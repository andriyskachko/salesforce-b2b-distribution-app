import { LightningElement, wire } from 'lwc';
import {
  MessageContext,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE
} from 'lightning/messageService';
import WarehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import WAREHOUSE_OBJECT from '@salesforce/schema/Warehouse__c';
import WAREHOUSE_LOCATION_ID_FIELD from '@salesforce/schema/Warehouse__c.LocationId__c';

const FIELDS = [WAREHOUSE_LOCATION_ID_FIELD];

export default class WarehouseInfo extends LightningElement {
  fields = FIELDS;
  objectApiName = WAREHOUSE_OBJECT;
  subscriptions = [];

  /** @type {string} */
  warehouseId;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.initSubscriptions();
  }

  disconnectedCallback() {
    this.terminateSubscriptions();
  }

  initSubscriptions() {
    this.subscribeToWarehouseSelectedMessageChannel();
  }

  terminateSubscriptions() {
    this.subscriptions.forEach((sub) => {
      unsubscribe(sub);
    });

    this.subscriptions = [];
  }

  subscribeToWarehouseSelectedMessageChannel() {
    const sub = subscribe(
      this.messageContext,
      WarehouseSelectedChannel,
      (message) => this.handleWarehouseSelected(message),
      { scope: APPLICATION_SCOPE }
    );

    this.subscriptions.push(sub);
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
