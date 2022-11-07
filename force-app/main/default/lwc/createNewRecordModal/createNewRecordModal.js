import { api } from 'lwc';
import LightningModal from 'lightning/modal';

export default class CreateNewRecordModal extends LightningModal {
  /** @type {Prop[]} */
  @api props;
  @api objectName = '';
  @api objectApiName = '';
  @api fields = [];

  get heading() {
    return `Add new ${this.objectName}`;
  }

  handleCancel() {
    this.close();
  }

  handleSubmit(event) {
    event.preventDefault();
    const fields = event.detail.fields;
    this.props.forEach((prop) => {
      fields[prop.fieldName] = prop.value;
    });
    this.template.querySelector('lightning-record-form').submit(fields);
  }

  handleSuccess(event) {
    this.close(event.detail.id);
  }
}
