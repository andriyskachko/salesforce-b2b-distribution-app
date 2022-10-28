import { LightningElement, wire } from "lwc";
import Fulfilment_Request_Name_FIELD from "@salesforce/schema/Fulfilment_Request__c.Name";
import Fulfilment_Request_Fullfilled__c_FIELD from "@salesforce/schema/Fulfilment_Request__c.Fulfilled__c";
import Fulfilment_Request_Due_Date__c_FIELD from "@salesforce/schema/Fulfilment_Request__c.Due_Date__c";
import Fulfilment_Request_Assigned_To__c_FIELD from "@salesforce/schema/Fulfilment_Request__c.Assigned_To__c";
import getFulfilmentRequestsByWarehouseId from "@salesforce/apex/WarehouseController.getFulfilmentRequestsByWarehouseId";
import {
  MessageContext,
  subscribe,
  unsubscribe
} from "lightning/messageService";
import warehouseSelectedChannel from "@salesforce/messageChannel/WarehouseSelectedChannel__c";

const COLUMNS = [
  {
    label: "Request Name",
    fieldName: "RequestUrl",
    type: "url",
    typeAttributes: {
      label: { fieldName: Fulfilment_Request_Name_FIELD.fieldApiName }
    },
    target: "_blank",
    sortable: true
  },
  {
    label: "Assigned To",
    fieldName: Fulfilment_Request_Assigned_To__c_FIELD.fieldApiName,
    type: "text",
    sortable: true
  },
  {
    label: "Due Date",
    fieldName: Fulfilment_Request_Due_Date__c_FIELD.fieldApiName,
    type: "date",
    typeAttributes: {
      day: "numeric",
      month: "short",
      year: "numeric"
    },
    sortable: true
  },
  {
    label: "Fulfilled",
    fieldName: Fulfilment_Request_Fullfilled__c_FIELD.fieldApiName,
    type: "text",
    sortable: true
  }
];

export default class WarehouseFulfilmentRequestsHistory extends LightningElement {
  warehouseId;
  columns = COLUMNS;
  subscription;
  defaultSortDirection = "asc";
  sortDirection = "asc";
  sortedBy;

  @wire(getFulfilmentRequestsByWarehouseId, { warehouseId: "$warehouseId" })
  wiredFulfilmentRequestsHistory({ error, data }) {
    if (data) {
      this.data = {
        RequestUrl: "/" + data.Id,
        RequestName: data.Name,
        DueDate: data.Due_Date__c,
        Fulfilled: data.Fulfilled__c,
        AssignedTo: data.Assigned_To__c
      };
      this.error = undefined;
      console.log(this.data);
    } else if (error) {
      this.data = undefined;
      this.error = error;
    }
  }

  @wire(MessageContext)
  messageContext;

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  disconnectedCallback() {
    this.unsubscribeMessageChannel();
  }

  subscribeToMessageChannel() {
    if (!this.subscription) {
      this.subscription = subscribe(
        this.messageContext,
        warehouseSelectedChannel,
        (message) => this.handleWarehouseSelected(message)
      );
    }
  }

  unsubscribeMessageChannel() {
    unsubscribe(this.subscription);
    this.subscription = null;
  }

  handleWarehouseSelected(message) {
    const { warehouseId } = message;
    this.warehouseId = warehouseId;
    console.log(warehouseId);
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortedBy, this.sortDirection);
  }

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === "asc" ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : "";
      b = key(b) ? key(b) : "";
      return isReverse * ((a > b) - (b > a));
    });
    this.data = parsedData;
  }

  handleFilter(event) {
    console.log(event.detail);
  }
}
