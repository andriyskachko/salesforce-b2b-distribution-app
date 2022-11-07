import { LightningElement, wire } from 'lwc';
import regionSelected from '@salesforce/messageChannel/RegionSelectedChannel__c';
import getRegions from '@salesforce/apex/RegionController.getRegions';
import { publish, MessageContext } from 'lightning/messageService';

export default class RegionPicker extends LightningElement {
  value = '';

  @wire(getRegions)
  _regions;

  @wire(MessageContext)
  messageContext;

  publishPayload() {
    const payload = { regionId: this.value };
    publish(this.messageContext, regionSelected, payload);
  }

  handleChange(event) {
    this.value = event.detail.value;
    this.publishPayload();
    this.dispatchEvent(new CustomEvent('changeregion', { detail: this.value }));
  }

  /** @type {RegionDTO[]} */
  get regions() {
    return this._regions ? this._regions.data : [];
  }

  /** @type {Option[]} */
  get options() {
    if (this.regions) {
      return this.regions.map((region) => {
        return {
          label: region.name,
          value: region.id
        };
      });
    }
    return [];
  }
}
