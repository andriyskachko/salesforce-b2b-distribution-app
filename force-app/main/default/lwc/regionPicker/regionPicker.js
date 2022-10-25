import { LightningElement, wire, track } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRegions from "@salesforce/apex/RegionController.getRegions";

export default class RegionPicker extends LightningElement {
  @track value = "";
  @track optionsArray = [];

  get options() {
    return this.optionsArray;
  }

  @wire(getRegions)
  regions({ error, data }) {
    if (data) {
      this.optionsArray = data.map((region) => {
        return { label: region.Name, value: region.Id };
      });
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
    const changeEvent = new CustomEvent("changeregion", {
      detail: this.value
    });
    this.dispatchEvent(changeEvent);
  }
}
