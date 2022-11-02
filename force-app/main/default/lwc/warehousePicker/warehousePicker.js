import { LightningElement, wire } from 'lwc';
import {
  publish,
  MessageContext,
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE
} from 'lightning/messageService';
import warehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import regionSelectedChannel from '@salesforce/messageChannel/RegionSelectedChannel__c';
import getWarehousesInRegion from '@salesforce/apex/WarehouseController.getWarehousesInRegion';

export default class WarehousePicker extends LightningElement {
  regionSelectedSubscription;

  /** @type {string} */
  regionId;
  value = '';

  /** @type {WarehouseDTO[]} */
  _warehouses;

  placeHolder = 'Select Region first';
  disabled = true;

  @wire(MessageContext)
  messageContext;

  @wire(getWarehousesInRegion, { regionId: '$regionId' })
  warehouses({ error, data }) {
    if (data) {
      this._warehouses = data;
      if (this._warehouses.length) {
        this.placeHolder = 'Select Warehouse';
        this.disabled = false;
      } else {
        this.placeHolder = 'No Warehouses in the Region';
        this.disabled = true;
      }
      this.error = undefined;
    } else if (error) {
      this._warehouses = undefined;
      this.error = error;
    }
  }

  connectedCallback() {
    this.subscribeToRegionSelectedMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeRegionSelectedMessageChannel();
  }

  subscribeToRegionSelectedMessageChannel() {
    if (!this.regionSelectedSubscription) {
      this.regionSelectedSubscription = subscribe(
        this.messageContext,
        regionSelectedChannel,
        (message) => this.handleRegionSelected(message),
        { scope: APPLICATION_SCOPE }
      );
    }
  }

  unsubscribeRegionSelectedMessageChannel() {
    unsubscribe(this.regionSelectedSubscription);
    this.regionSelectedSubscription = null;
  }

  /** @param {RegionPayload} message */
  handleRegionSelected(message) {
    const { regionId } = message;
    this.regionId = regionId;
    this.resetWarehouse();
  }

  handleChange(event) {
    this.value = event.detail.value;
    this.publishPayload();
  }

  resetWarehouse() {
    this.value = '';
    this.publishPayload();
  }

  publishPayload() {
    const payload = { warehouseId: this.value };
    publish(this.messageContext, warehouseSelectedChannel, payload);
  }

  /** @type {Option[]} */
  get options() {
    if (this._warehouses) {
      return this._warehouses.map((warehouse) => {
        return {
          label: warehouse.name,
          value: warehouse.id
        };
      });
    }
    return null;
  }
}
