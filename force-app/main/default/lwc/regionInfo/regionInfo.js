import { LightningElement, wire } from "lwc";
import getRegionById from "@salesforce/apex/RegionController.getRegionById";
import ChangeRegionalManagerModal from "c/changeRegionalManagerModal";
import "./regionInfo.css";

export default class RegionInfo extends LightningElement {
  /** @type {string} */
  regionId;

  /** @type {RegionDTO} */
  _regionInfo;

  @wire(getRegionById, { regionId: "$regionId" })
  wiredGetRegionById({ error, data }) {
    if (data) {
      this._regionInfo = { ...data };
      this.error = undefined;
    } else if (error) {
      this._regionInfo = undefined;
      this.error = error;
    }
  }

  get regionInfo() {
    return this._regionInfo;
  }

  get regionName() {
    return this._regionInfo.name;
  }

  get regionUrl() {
    return "/" + this._regionInfo.id;
  }

  get regionalManagerName() {
    return this._regionInfo.regionalManagerName;
  }

  get regionalManagerUrl() {
    return "/" + this._regionInfo.regionalManagerId;
  }

  handleChangeRegion(event) {
    this.regionId = event.detail;
  }

  async handleChangeRegionalManager() {
    const result = await ChangeRegionalManagerModal.open({
      size: "medium",
      description: "Accessible description of modal's purpose",
      regionId: this.regionId
    });
    console.log(result);
  }
}
