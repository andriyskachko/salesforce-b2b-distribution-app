import { LightningElement, wire, api } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import warehouseSelected from "@salesforce/messageChannel/WarehouseSelectedChannel__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getWarehousesInRegion from "@salesforce/apex/WarehouseController.getWarehousesInRegion";

export default class WarehousePicker extends LightningElement {
  /** @type {string} */
  @api regionId;
  value = "";

  /** @type {WarehouseDTO[]} */
  _warehouses;

  placeHolder = "Select Region first";
  disabled = true;

  @wire(MessageContext)
  messageContext;

  @wire(getWarehousesInRegion, { regionId: "$regionId" })
  warehouses({ error, data }) {
    if (data) {
      this._warehouses = data;
      if (this._warehouses.length) {
        this.placeHolder = "Select Warehouse";
        this.disabled = false;
      } else {
        this.placeHolder = "No Warehouses in the Region";
        this.disabled = true;
      }
    } else if (error) {
      this.showErrorToast(error);
    }
  }

  showErrorToast(error) {
    const event = new ShowToastEvent({
      title: "Unexpected Error Occured",
      message: error.body.message
    });
    this.dispatchEvent(event);
  }

  handleChange(event) {
    this.value = event.detail.value;
    this.publishPayload();
  }

  @api
  resetWarehouse() {
    this.value = "";
    this.publishPayload();
  }

  publishPayload() {
    const payload = { warehouseId: this.value };
    publish(this.messageContext, warehouseSelected, payload);
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
