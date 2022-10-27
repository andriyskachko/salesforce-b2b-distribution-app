import { LightningElement, wire } from "lwc";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import warehouseSelectedChannel from "@salesforce/messageChannel/WarehouseSelectedChannel__c";
import getWarehouseInfoById from "@salesforce/apex/WarehouseController.getWarehouseInfoById";

export default class WarehouseInfo extends LightningElement {
  warehouseId;
  warehouseInfo;

  @wire(MessageContext)
  messageContext;

  @wire(getWarehouseInfoById, { warehouseId: "$warehouseId" })
  wiredGetWarehouseInfo({ error, data }) {
    if (data) {
      this.warehouseInfo = {
        locationUrl: "/" + data.LocationId__r.Id,
        locationName: data.LocationId__r.Name,
        ...data
      };
      this.error = undefined;
      console.log(this.warehouseInfo);
    } else if (error) {
      this.error = error;
      this.warehouseInfo = undefined;
      console.log(this.error);
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
}
