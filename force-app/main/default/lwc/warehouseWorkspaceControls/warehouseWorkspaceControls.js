import { LightningElement } from "lwc";

export default class WarehouseWorkspaceControls extends LightningElement {
  /** @type {string} */
  _regionId;

  handleChangeRegion(event) {
    const newRegionId = event.detail;
    if (this.regionId !== newRegionId) {
      this._regionId = newRegionId;
      this.template.querySelector("c-warehouse-picker").resetWarehouse();
    }
  }

  get regionId() {
    return this._regionId;
  }

  handleChangeWarehouse(event) {
    console.log(event.detail);
  }
}
