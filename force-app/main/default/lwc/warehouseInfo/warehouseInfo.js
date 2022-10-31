import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  APPLICATION_SCOPE,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import warehouseSelectedChannel from "@salesforce/messageChannel/WarehouseSelectedChannel__c";
import getWarehouseInfoById from "@salesforce/apex/WarehouseController.getWarehouseInfoById";

export default class WarehouseInfo extends LightningElement {
  /** @type {string} */
  warehouseId;
  /** @type {WarehouseDTO} */
  _warehouseInfo;

  @wire(MessageContext)
  messageContext;

  @wire(getWarehouseInfoById, { warehouseId: "$warehouseId" })
  wiredGetWarehouseInfo({ error, data }) {
    if (data) {
      this._warehouseInfo = data;
      this.error = undefined;
    } else if (error) {
      this.error = error;
      this._warehouseInfo = undefined;
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

  get warehouseInfo() {
    return this._warehouseInfo;
  }
}
