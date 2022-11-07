import { LightningElement } from 'lwc';
import REGION_OBJECT from '@salesforce/schema/Region__c';
import REGIONAL_MANAGER_FIELD from '@salesforce/schema/Region__c.Regional_ManagerId__c';

const FIELDS = [REGIONAL_MANAGER_FIELD];

export default class RegionInfo extends LightningElement {
  fields = FIELDS;
  objectApiName = REGION_OBJECT;

  /** @type {string} */
  regionId;

  handleChangeRegion(event) {
    this.regionId = event.detail;
  }
}
