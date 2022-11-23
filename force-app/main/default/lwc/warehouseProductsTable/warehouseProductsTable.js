import { LightningElement, wire } from 'lwc';
import {
  MessageContext,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE
} from 'lightning/messageService';
import WarehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import CreateNewRecordModal from 'c/createNewRecordModal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProductItemsInWarehouse from '@salesforce/apex/WarehouseController.getProductItemsInWarehouse';
import getWarehouseLocationId from '@salesforce/apex/WarehouseController.getWarehouseLocationId';
import PRODUCT_ITEM_OBJECT from '@salesforce/schema/ProductItem';
import PRODUCT_NAME_FIELD from '@salesforce/schema/ProductItem.Product2Id';
import LOCATION_FIELD from '@salesforce/schema/ProductItem.LocationId';
import QUANTITY_ON_HAND_FIELD from '@salesforce/schema/ProductItem.QuantityOnHand';
import QUANTITY_UNIT_OF_MEASURE_FIELD from '@salesforce/schema/ProductItem.QuantityUnitOfMeasure.';
import SERIAL_NUMBER_FIELD from '@salesforce/schema/ProductItem.SerialNumber';

const FIELDS = [
  PRODUCT_NAME_FIELD,
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
  defaultSortDirection = 'asc';
  sortDirection = 'asc';
  sortedBy = '';
  columns = COLUMNS;
  fields = FIELDS;
  objectApiName = PRODUCT_ITEM_OBJECT;
  warehouseId = '';
  subscriptions = [];
  /** @type {ProductItemDTO[]} */
  _data = [];
  /** @type {ProductItemDTO[]} */
  _filteredData = [];

  @wire(MessageContext)
  messageContext;

  @wire(getProductItemsInWarehouse, { warehouseId: '$warehouseId' })
  wiredGetProductItems({ error, data }) {
    if (data) {
      this._data = data;
      this._filteredData = this._data;
      this.error = undefined;
    } else if (error) {
      this._data = [];
      this._filteredData = [];
      this.error = error;
    }
  }

  @wire(getWarehouseLocationId, { warehouseId: '$warehouseId' })
  _locationId;

  connectedCallback() {
    this.initSubscriptions();
  }

  disconnectedCallback() {
    this.terminateSubscriptions();
  }

  initSubscriptions() {
    this.subscribeToMessageChannel();
  }

  terminateSubscriptions() {
    this.subscriptions.forEach((sub) => {
      unsubscribe(sub);
    });

    this.subscriptions = [];
  }

  subscribeToMessageChannel() {
    const sub = subscribe(
      this.messageContext,
      WarehouseSelectedChannel,
      (message) => this.handleWarehouseSelected(message),
      { scope: APPLICATION_SCOPE }
    );

    this.subscriptions.push(sub);
  }

  /** @param {WarehousePayload} message*/
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
      const {
        // eslint-disable-next-line no-unused-vars
        productItemId,
        // eslint-disable-next-line no-unused-vars
        productItemUrl,
        // eslint-disable-next-line no-unused-vars
        productId,
        // eslint-disable-next-line no-unused-vars
        productUrl,
        ...recordData
      } = record;
      const recordString = JSON.stringify(
        Object.values(recordData)
      ).toLowerCase();
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
      objectName: 'Product Item',
      objectApiName: this.objectApiName,
      fields: this.fields,
      props: this.props
    });

    if (result) {
      const event = new ShowToastEvent({
        title: 'Successfully created a record',
        message: 'Record ID: ' + result,
        variant: 'success'
      });
      this.dispatchEvent(event);
    }
  }

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === 'asc' ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : '';
      b = key(b) ? key(b) : '';
      // @ts-ignore
      return isReverse * ((a > b) - (b > a));
    });
    this._filteredData = parsedData;
  }

  get warehouseIsEmpty() {
    return this.warehouseId && this._data.length === 0;
  }

  /** @type {string} */
  get locationId() {
    return this._locationId ? this._locationId.data : '';
  }

  get data() {
    return this._filteredData;
  }

  /** @type {Prop[]} */
  get props() {
    return [
      {
        fieldName: LOCATION_FIELD.fieldApiName,
        value: this.locationId
      }
    ];
  }
}
