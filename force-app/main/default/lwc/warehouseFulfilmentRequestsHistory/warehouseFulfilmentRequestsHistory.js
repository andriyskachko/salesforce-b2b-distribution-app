import { LightningElement, wire } from 'lwc';
import getFulfilmentRequestsByWarehouseId from '@salesforce/apex/WarehouseController.getFulfilmentRequestsByWarehouseId';
import {
  APPLICATION_SCOPE,
  MessageContext,
  subscribe,
  unsubscribe
} from 'lightning/messageService';
import warehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';

export default class WarehouseFulfilmentRequestsHistory extends LightningElement {
  /** @type {string} */
  warehouseId;
  subscription;
  /** @type {FulfilmentRequestDTO[]} */
  _requests = [];

  @wire(getFulfilmentRequestsByWarehouseId, { warehouseId: '$warehouseId' })
  wiredRequests({ error, data }) {
    if (data) {
      this._requests = data;
      this.error = undefined;
      console.log(this._requests);
    } else if (error) {
      this._requests = [];
      this.error = error;
    }
  }

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
  }

  handleViewAll() {
    console.log('handled view all');
  }

  handleAddRequest() {
    console.log('handled add request');
  }

  /** @type {FulfilmentRequestDTO} */
  get latestFulfilmentRequest() {
    return this._requests[0];
  }

  /** @type {Number} */
  get requestsCount() {
    return this._requests.length;
  }

  /** @type {string} */
  get cardTitle() {
    return 'Fulfilment Requests' + this.cardTitleCount;
  }

  /** @type {string} */
  get cardTitleCount() {
    return this.warehouseId ? ` (${this.requestsCount})` : '';
  }
}
