import { api, wire } from "lwc";
import LightningModal from "lightning/modal";
import getUsersBySearchKey from "@salesforce/apex/UserController.getUsersBySearchKey";

export default class ChangeRegionalManagerModal extends LightningModal {
  /** @type {User[]} */
  _users;

  @api content = "";

  searchKey = "";

  /** @type {User} */
  @api selectedUser;

  @wire(getUsersBySearchKey, { searchKey: "$searchKey" })
  wiredGetUsersBySearchKey({ error, data }) {
    if (data) {
      this._users = data;
      this.error = undefined;
      console.log(this._users);
    } else if (error) {
      this._users = undefined;
      this.error = error;
      console.log(error);
    }
  }

  get users() {
    return this._users;
  }

  handleAssignRegionalManager() {
    this.close("assigned");
  }

  handleCancel() {
    this.close("canceled");
  }

  handleChange(event) {
    console.log(event.detail);
    this.searchValue = event.detail;
  }
}
