import { LightningElement, wire } from "lwc";
import getProductItemsInWarehouse from "@salesforce/apex/WarehouseController.getProductItemsInWarehouse";
import Product_Item_Number_FIELD from "@salesforce/schema/ProductItem.ProductItemNumber";
import Product_Item_Quantity_On_Hand_FIELD from "@salesforce/schema/ProductItem.QuantityOnHand";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import warehouseSelectedChannel from "@salesforce/messageChannel/WarehouseSelectedChannel__c";

const COLUMNS = [
  {
    label: "Product Item Number",
    fieldName: "ProductItemUrl",
    type: "url",
    typeAttributes: {
      label: { fieldName: Product_Item_Number_FIELD.fieldApiName }
    },
    target: "_blank",
    sortable: true
  },
  {
    label: "Product Name",
    fieldName: "ProductUrl",
    type: "url",
    typeAttributes: { label: { fieldName: "ProductName" } },
    target: "_blank",
    sortable: true
  },
  {
    label: "Quantity on site",
    fieldName: Product_Item_Quantity_On_Hand_FIELD.fieldApiName,
    sortable: true
  }
];

export default class WarehouseProductsTable extends LightningElement {
  columns = COLUMNS;
  warehouseId;
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;

  subscription;
  data = [];

  @wire(MessageContext)
  messageContext;

  @wire(getProductItemsInWarehouse, { warehouseId: "$warehouseId" })
  getProductItems({ error, data }) {
    if (data) {
      this.data = data.map((record) => {
        return {
          ProductName: record.Product2.Name,
          ProductUrl: "/" + record.Product2.Id,
          ProductItemUrl: "/" + record.Id,
          ...record
        };
      });
    } else if (error) {
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
        (message) => this.handleWarehouseSelected(message)
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

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === "asc" ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : "";
      b = key(b) ? key(b) : "";
      return isReverse * ((a > b) - (b > a));
    });
    this.data = parsedData;
  }
}
