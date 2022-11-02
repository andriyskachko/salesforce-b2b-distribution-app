import { LightningElement } from 'lwc';
import REGION_OBJECT from '@salesforce/schema/Region__c';
import REGION_NAME_FIELD from '@salesforce/schema/Region__c.Name';
import REGIONAL_MANAGER_FIELD from '@salesforce/schema/Region__c.Regional_ManagerId__c';

const FIELDS = [
  REGION_NAME_FIELD.fieldApiName,
  REGIONAL_MANAGER_FIELD.fieldApiName
];

export default class RegionInfo extends LightningElement {
  fields = FIELDS;
  objectApiName = REGION_OBJECT.objectApiName;

  /** @type {string} */
  regionId;

  handleChangeRegion(event) {
    this.regionId = event.detail;
  }
}
