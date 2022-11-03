import { LightningElement, wire } from 'lwc';
import getProductItemsInWarehouse from '@salesforce/apex/WarehouseController.getProductItemsInWarehouse';
import {
  APPLICATION_SCOPE,
  MessageContext,
  subscribe,
  unsubscribe
} from 'lightning/messageService';
import warehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import CreateNewRecordModal from 'c/createNewRecordModal';
import PRODUCT_ITEM_OBJECT from '@salesforce/schema/ProductItem';
import PRODUCT_NAME_FIELD from '@salesforce/schema/ProductItem.Product2Id';
import LOCATION_FIELD from '@salesforce/schema/ProductItem.LocationId';
import QUANTITY_ON_HAND_FIELD from '@salesforce/schema/ProductItem.QuantityOnHand';
import QUANTITY_UNIT_OF_MEASURE_FIELD from '@salesforce/schema/ProductItem.QuantityUnitOfMeasure.';
import SERIAL_NUMBER_FIELD from '@salesforce/schema/ProductItem.SerialNumber';

const OBJECT_API_NAME = PRODUCT_ITEM_OBJECT;

const FIELDS = [
  PRODUCT_NAME_FIELD,
  LOCATION_FIELD,
  SERIAL_NUMBER_FIELD,
  QUANTITY_ON_HAND_FIELD,
  QUANTITY_UNIT_OF_MEASURE_FIELD
];

/** @type {DatatableColumn[]} */
const COLUMNS = [
  {
    label: 'Product Item Number',
    fieldName: 'productItemUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'productItemNumber' } },
    target: '_blank',
    sortable: true
  },
  {
    label: 'Product Name',
    fieldName: 'productUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'productName' } },
    target: '_blank',
    sortable: true
  },
  {
    label: 'Quantity on site',
    type: 'text',
    fieldName: 'productItemQuantity',
    sortable: true
  }
];

export default class WarehouseProductsTable extends LightningElement {
  searchString = '';
  columns = COLUMNS;
  warehouseId;
  defaultSortDirection = 'asc';
  sortDirection = 'asc';
  sortedBy;
  subscription;
  fields = FIELDS;
  objectApiName = OBJECT_API_NAME;

  /** @type {ProductItemDTO[]} */
  _data;

  /** @type {ProductItemDTO[]} */
  _filteredData;

  @wire(MessageContext)
  messageContext;

  @wire(getProductItemsInWarehouse, { warehouseId: '$warehouseId' })
  wiredGetProductItems({ error, data }) {
    if (data) {
      this._data = data;
      this._filteredData = this._data;
      this.error = undefined;
    } else if (error) {
      this._data = undefined;
      this.error = error;
    }
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        warehouseSelectedChannel,
        (message) => this.handleWarehouseSelected(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleWarehouseSelected(message) {
    const { warehouseId } = message;
    this.warehouseId = warehouseId;
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortedBy, this.sortDirection);
  }

  handleSearch(event) {
    this.searchString = event.detail.value.toLowerCase();
    this._filteredData = this._data.filter((record) => {
      const recordString = JSON.stringify(record).toLowerCase();
      const regex = new RegExp(this.searchString);
      return regex.test(recordString);
    });
  }

  handleViewAll() {
    console.log('view all pressed');
  }

  async handleAddProductItem() {
    const result = await CreateNewRecordModal.open({
      size: 'small',
      description: "Accessible description of modal's purpose",
      objectName: 'Product Item',
      objectApiName: this.objectApiName,
      fields: this.fields
    });
    console.log(result);
  }

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === 'asc' ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : '';
      b = key(b) ? key(b) : '';
      return isReverse * ((a > b) - (b > a));
    });
    this._data = parsedData;
  }

  get warehouseIsNotEmpty() {
    return this.warehouseId && this.data;
  }

  get warehouseIsSelected() {
    return !!this.warehouseId;
  }

  get data() {
    return this._filteredData;
  }
}
