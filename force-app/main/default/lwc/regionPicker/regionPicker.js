import { LightningElement, wire } from "lwc";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getRegions from "@salesforce/apex/RegionController.getRegions";

export default class RegionPicker extends LightningElement {
  value = "";

  /** @type {RegionDTO[]} */
  _regions;

  /** @type {Option[]} */
  get options() {
    if (this._regions) {
      return this._regions.map((region) => {
        return {
          label: region.name,
          value: region.id
        };
      });
    }
    return null;
  }

  @wire(getRegions)
  wiredGetRegions({ error, data }) {
    if (data) {
      this._regions = data;
      this.error = undefined;
    } else if (error) {
      this._regions = undefined;
      this.error = error;
      this.showErrorToast(this.error);
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
