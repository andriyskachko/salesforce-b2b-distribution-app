import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class CreateNewRecordModal extends LightningModal {
  @api objectName;
  @api objectApiName;
  @api fields;

  get heading() {
    return `Add new ${this.objectName}`;
  }

  handleCancel() {
    this.close();
  }

  handleSuccess(event) {
    this.close(event.detail.id);
  }
}
