import { LightningElement, wire } from 'lwc';
import {
  MessageContext,
  APPLICATION_SCOPE,
  subscribe,
  unsubscribe
} from 'lightning/messageService';
import warehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import WAREHOUSE_OBJECT from '@salesforce/schema/Warehouse__c';
import WAREHOUSE_NAME_FIELD from '@salesforce/schema/Warehouse__c.Name';
import WAREHOUSE_LOCATION_ID_FIELD from '@salesforce/schema/Warehouse__c.LocationId__c';

const FIELDS = [
  WAREHOUSE_NAME_FIELD.fieldApiName,
  WAREHOUSE_LOCATION_ID_FIELD.fieldApiName
];

export default class WarehouseInfo extends LightningElement {
  fields = FIELDS;
  objectApiName = WAREHOUSE_OBJECT.objectApiName;

  /** @type {string} */
  warehouseId;

  @wire(MessageContext)
  messageContext;

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
    console.log('Selected Warehouse ID: ' + this.warehouseId);
    console.log(this.objectApiName);
    this.fields.forEach((field) => console.log(field));
  }

  get warehouseInfo() {
    return this._warehouseInfo;
  }
}
