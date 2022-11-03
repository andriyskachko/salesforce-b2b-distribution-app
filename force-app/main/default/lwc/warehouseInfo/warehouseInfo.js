import { LightningElement, wire } from 'lwc';
import {
  MessageContext,
  APPLICATION_SCOPE,
  subscribe,
  unsubscribe
} from 'lightning/messageService';
import warehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import WAREHOUSE_OBJECT from '@salesforce/schema/Warehouse__c';
import WAREHOUSE_LOCATION_ID_FIELD from '@salesforce/schema/Warehouse__c.LocationId__c';

const FIELDS = [WAREHOUSE_LOCATION_ID_FIELD.fieldApiName];

export default class WarehouseInfo extends LightningElement {
  fields = FIELDS;
  objectApiName = WAREHOUSE_OBJECT.objectApiName;
  warehouseSelectedSubscription;

  /** @type {string} */
  warehouseId;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscribeToWarehouseSelectedMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeWarehouseSelectedMessageChannel();
  }

  subscribeToWarehouseSelectedMessageChannel() {
    if (!this.warehouseSelectedSubscription) {
      this.warehouseSelectedSubscription = subscribe(
        this.messageContext,
        warehouseSelectedChannel,
        (message) => this.handleWarehouseSelected(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeWarehouseSelectedMessageChannel() {
    unsubscribe(this.warehouseSelectedSubscription);
    this.warehouseSelectedSubscription = null;
  }

  /** @param {WarehousePayload} message  */
  handleWarehouseSelected(message) {
    const { warehouseId } = message;
    this.warehouseId = warehouseId;
  }
}
