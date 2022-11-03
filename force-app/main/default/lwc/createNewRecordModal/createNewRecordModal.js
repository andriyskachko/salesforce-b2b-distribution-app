import { api } from 'lwc';
import LightningModal from 'lightning/modal';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateNewRecordModal extends LightningModal {
  @api objectName;
  @api objectApiName;
  @api fields;

  get heading() {
    return `Add new ${this.objectName}`;
  }

  handleSuccess(event) {
    const evt = new ShowToastEvent({
      title: 'Successfully created a record',
      message: 'Record ID: ' + event.detail.id,
      variant: 'success'
    });
    this.dispatchEvent(evt);
    this.close(true);
  }
}
