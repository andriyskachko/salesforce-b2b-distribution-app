import { LightningElement, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import regionSelected from '@salesforce/messageChannel/RegionSelectedChannel__c';
import getRegions from '@salesforce/apex/RegionController.getRegions';
import { publish, MessageContext } from 'lightning/messageService';

export default class RegionPicker extends LightningElement {
  value = '';

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

  @wire(MessageContext)
  messageContext;

  showErrorToast(error) {
    const event = new ShowToastEvent({
      title: 'Unexpected Error Occured',
      message: error.body.message
    });
    this.dispatchEvent(event);
  }

  publishPayload() {
    const payload = { regionId: this.value };
    publish(this.messageContext, regionSelected, payload);
  }

  handleChange(event) {
    this.value = event.detail.value;
    this.publishPayload();
    this.dispatchEvent(new CustomEvent('changeregion', { detail: this.value }));
  }
}
