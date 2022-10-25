import { LightningElement, track } from "lwc";

export default class WarehouseWorkspaceControls extends LightningElement {
  @track region;

  handleChangeRegion(event) {
    const newRegionId = event.detail;
    if (this.region !== newRegionId) {
      this.region = newRegionId;
      this.template.querySelector("c-warehouse-picker").resetWarehouse();
    }
  }

  handleChangeWarehouse(event) {
    console.log(event.detail);
  }
}
