import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import warehouseSelectedChannel from "@salesforce/messageChannel/WarehouseSelectedChannel__c";

import getFulfilmentRequestsByWarehouseId from "@salesforce/apex/WarehouseController.getFulfilmentRequestsByWarehouseId";

export default class WarehouseFulfilmentRequestsHistory extends LightningElement {
  warehouseId;

  @wire(getFulfilmentRequestsByWarehouseId, { warehouseId: "$warehouseId" })
  wiredFulfilmentRequestsHistory({ error, data }) {
    if (data) {
      this.data = data;
      this.error = undefined;
    } else if (error) {
      this.data = undefined;
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
    console.log(warehouseId);
  }
}
