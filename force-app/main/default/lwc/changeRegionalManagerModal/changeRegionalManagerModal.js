import LightningModal from "lightning/modal";
import { api } from "lwc";
import REGIONAL_MANAGER_FIELD from "@salesforce/schema/Region__c.Regional_ManagerId__c";

export default class ChangeRegionalManagerModal extends LightningModal {
  /** @type {string} */
  @api regionId;

  regionalManagerField = REGIONAL_MANAGER_FIELD.fieldApiName;
  obejctApiName = REGIONAL_MANAGER_FIELD.objectApiName;

  /** @type {User} */
  selectedUser;

  handleUserSelected(event) {
    this.selectedUser = event.target.value;
    console.log("the selected User id is" + this.selectedUser.id);
  }

  handleAssignRegionalManager() {
    this.close("assigned");
  }

  handleCancel() {
    this.close("canceled");
    console.log(this.regionId);
    console.log(this.obejctApiName);
    console.log(this.regionalManagerField);
  }
}
