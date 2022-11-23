import { LightningElement, wire } from 'lwc';
import getFulfilmentRequestsByWarehouseId from '@salesforce/apex/WarehouseController.getFulfilmentRequestsByWarehouseId';
import getWarehouseLocationId from '@salesforce/apex/WarehouseController.getWarehouseLocationId';
import getRegionalManagerByRegionId from '@salesforce/apex/RegionController.getRegionalManagerByRegionId';
import {
  APPLICATION_SCOPE,
  MessageContext,
  subscribe,
  unsubscribe
} from 'lightning/messageService';
import WarehouseSelectedChannel from '@salesforce/messageChannel/WarehouseSelectedChannel__c';
import RegionSelectedChannel from '@salesforce/messageChannel/RegionSelectedChannel__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CreateNewRecordModal from 'c/createNewRecordModal';
import FULFILMENT_REQUEST_OBJECT from '@salesforce/schema/Fulfilment_Request__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Fulfilment_Request__c.Description__c';
import ASSIGNED_FIELD from '@salesforce/schema/Fulfilment_Request__c.Assigned_To__c';
import LOCATION_FIELD from '@salesforce/schema/Fulfilment_Request__c.LocationId__c';
import DUE_DATE_FIELD from '@salesforce/schema/Fulfilment_Request__c.Due_Date__c';
import NAME_FIELD from '@salesforce/schema/Fulfilment_Request__c.Name';
import PRODUCT_ITEM_FIELD from '@salesforce/schema/Fulfilment_Request__c.Product_ItemId__c';
import QUANTITY_REQUESTED_FIELD from '@salesforce/schema/Fulfilment_Request__c.Quantity_Requested__c';

const MODAL_FIELDS = [
  NAME_FIELD,
  DESCRIPTION_FIELD,
  PRODUCT_ITEM_FIELD,
  QUANTITY_REQUESTED_FIELD,
  DUE_DATE_FIELD
];

const OWN_RECORD_FIELDS = [
  ASSIGNED_FIELD,
  PRODUCT_ITEM_FIELD,
  QUANTITY_REQUESTED_FIELD,
  DUE_DATE_FIELD
];

export default class FulfilmentRequests extends LightningElement {
  modalFields = MODAL_FIELDS;
  ownRecordFields = OWN_RECORD_FIELDS;
  objectApiName = FULFILMENT_REQUEST_OBJECT;
  regionId = '';
  warehouseId = '';
  subscriptions = [];
  /** @type {FulfilmentRequestDTO[]} */
  requests = [];
  error;

  @wire(getFulfilmentRequestsByWarehouseId, { warehouseId: '$warehouseId' })
  wiredRequests({ error, data }) {
    if (data) {
      this.requests = data;
      this.error = undefined;
    } else if (error) {
      this.erorr = error;
      this.requests = [];
    }
  }

  @wire(getRegionalManagerByRegionId, { regionId: '$regionId' })
  _regionalManager;

  @wire(getWarehouseLocationId, { warehouseId: '$warehouseId' })
  _locationId;

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.initSubscriptions();
  }

  disconnectedCallback() {
    this.terminateSubscriptions();
  }

  initSubscriptions() {
    this.subscribeToWarehouseMessageChannel();
    this.subscribeToRegionMessageChannel();
  }

  terminateSubscriptions() {
    this.subscriptions.forEach((sub) => {
      unsubscribe(sub);
    });

    this.subscriptions = [];
  }

  subscribeToWarehouseMessageChannel() {
    const sub = subscribe(
      this.messageContext,
      WarehouseSelectedChannel,
      (message) => this.handleWarehouseSelected(message),
      { scope: APPLICATION_SCOPE }
    );
    this.subscriptions.push(sub);
  }

  subscribeToRegionMessageChannel() {
    const sub = subscribe(
      this.messageContext,
      RegionSelectedChannel,
      (message) => this.handleRegionSelected(message),
      { scope: APPLICATION_SCOPE }
    );
    this.subscriptions.push(sub);
  }

  /** @param {WarehousePayload} message */
  handleWarehouseSelected(message) {
    const { warehouseId } = message;
    this.warehouseId = warehouseId;
  }

  /** @param {RegionPayload} message */
  handleRegionSelected(message) {
    const { regionId } = message;
    this.regionId = regionId;
  }

  handleViewAll() {
    console.log('handled view all');
    console.log(this.propsForModalComponent);
  }

  async handleAddRequest() {
    const result = await CreateNewRecordModal.open({
      size: 'small',
      objectName: 'Fulfilment Request',
      objectApiName: this.objectApiName,
      fields: this.modalFields,
      props: this.propsForModalComponent
    });

    if (result) {
      const evt = new ShowToastEvent({
        title: 'Successfully created a record',
        message: 'Record ID: ' + result,
        variant: 'success'
      });
      this.dispatchEvent(evt);
    }
  }

  get cardTitle() {
    return 'New Fulfilment Requests ' + this.cardTitleCount;
  }

  /** @type {string} */
  get locationId() {
    return this._locationId ? this._locationId.data : '';
  }

  /** @type {string} */
  get regionalManagerId() {
    return this._regionalManager ? this._regionalManager.data : '';
  }

  /** @type {Prop[]} */
  get propsForModalComponent() {
    return [
      {
        fieldName: ASSIGNED_FIELD.fieldApiName,
        value: this.regionalManagerId
      },
      { fieldName: LOCATION_FIELD.fieldApiName, value: this.locationId }
    ];
  }

  get requestName() {
    return this.latestFulfilmentRequest.requestName;
  }

  get requestsCount() {
    return this.requests.filter((req) => {
      return req.status === 'New';
    }).length;
  }

  get cardTitleCount() {
    return this.warehouseId ? '(' + this.requestsCount + ')' : '';
  }

  /** @type {FulfilmentRequestDTO} */
  get latestFulfilmentRequest() {
    return this.requests.length ? this.requests[0] : null;
  }

  /** @type {string} */
  get requestId() {
    return this.latestFulfilmentRequest.requestId;
  }
}
