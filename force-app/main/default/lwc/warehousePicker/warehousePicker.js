import { LightningElement, wire, api } from "lwc";
import { publish, MessageContext } from "lightning/messageService";
import warehouseSelected from "@salesforce/messageChannel/WarehouseSelectedChannel__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getWarehousesInRegion from "@salesforce/apex/WarehouseController.getWarehousesInRegion";

export default class WarehousePicker extends LightningElement {
  @api region;
  value = "";
  optionsArray = [];
  placeHolder = "Select Region first";
  disabled = true;

  @wire(MessageContext)
  messageContext;

  @wire(getWarehousesInRegion, { regionId: "$region" })
  warehouses({ error, data }) {
    if (data) {
      this.optionsArray = data.map((warehouse) => {
        return { label: warehouse.Name, value: warehouse.Id };
      });
      if (this.optionsArray.length) {
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

  get options() {
    return this.optionsArray;
  }
}
