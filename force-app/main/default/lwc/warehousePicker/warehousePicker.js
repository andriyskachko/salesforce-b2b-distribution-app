import { LightningElement, wire, track, api } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getWarehousesInRegion from "@salesforce/apex/WarehouseController.getWarehousesInRegion";

export default class WarehousePicker extends LightningElement {
  @api region;
  @track value = "";
  @track optionsArray = [];
  @track placeHolder = "Select Region first";
  @track disabled = true;

  get options() {
    return this.optionsArray;
  }

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
    const changeEvent = new CustomEvent("changewarehouse", {
      detail: this.value
    });
    this.dispatchEvent(changeEvent);
  }

  @api
  resetWarehouse() {
    this.value = "";
  }
}
