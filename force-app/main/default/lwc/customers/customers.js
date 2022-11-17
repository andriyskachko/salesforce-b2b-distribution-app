import { LightningElement, wire } from 'lwc';
import { MessageContext, publish } from 'lightning/messageService';
import AccountSelectedChannel from '@salesforce/messageChannel/AccountSelectedChannel__c';
import getSalesManagerAssignedCustomers from '@salesforce/apex/AccountController.getSalesManagerAssignedCustomers';
import Id from '@salesforce/user/Id';

/** @type {DatatableColumn[]} */
const COLUMNS = [
  {
    label: 'Customer',
    fieldName: 'url',
    type: 'url',
    typeAttributes: { label: { fieldName: 'name' } },
    target: '_blank',
    sortable: true
  },
  {
    label: 'Assigned By',
    fieldName: 'assignedByUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'assignedBy' } },
    target: '_blank'
  },
  {
    label: 'Last Contacted At',
    fieldName: 'lastContactedAt',
    type: 'text',
    sortable: true
  },
  {
    label: 'Year Started',
    fieldName: 'yearStarted',
    type: 'text',
    sortable: true
  }
];

/** @type {Option[]} */
const OPTIONS = [
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '20', value: '20' }
];

export default class Customers extends LightningElement {
  userId = Id;
  /** @type {AccountDTO[]} */
  _accounts = [];
  /** @type {AccountDTO[]} */
  _filteredAccounts = [];
  /** @type {AccountDTO[]} */
  selectedAccounts = [];
  /** @type {AccountDTO[]} */
  allSelectedAccounts = [];
  columns = COLUMNS;
  error;
  searchString = '';
  defaultSortDirection = 'asc';
  sortDirection = 'asc';
  sortedBy = '';
  pageNumber = 0;
  /** @type {AccountDTO[]} */
  pageAccounts = [];
  options = OPTIONS;
  displayAmount = OPTIONS[0].value;

  @wire(getSalesManagerAssignedCustomers, { userId: '$userId' })
  wiredAccounts({ error, data }) {
    if (data) {
      this._accounts = data;
      this._filteredAccounts = this._accounts;
      this.selectedAccounts = this._accounts;
      this.erorr = undefined;
      this.publishPayload();
    } else if (error) {
      this._accounts = [];
      this._filteredAccounts = [];
      this.selectedAccounts = [];
      this.erorr = error;
      this.publishPayload();
    }
  }

  @wire(MessageContext)
  messageContext;

  get data() {
    return this._filteredAccounts;
  }

  publishPayload() {
    publish(
      this.messageContext,
      AccountSelectedChannel,
      this.selectedAccounts.map((a) => a.id)
    );
  }

  handleSearch(event) {
    this.searchString = event.detail.value.toLowerCase();
    this._filteredAccounts = this._accounts.filter((record) => {
      const recordString = JSON.stringify(record).toLowerCase();
      const regex = new RegExp(this.searchString);
      return regex.test(recordString);
    });
  }

  handleRowSelection(event) {
    const selectedRows = event.detail.selectedRows;
    if (selectedRows.length) {
      this.selectedAccounts = selectedRows;
    } else {
      this.selectedAccounts = this._accounts;
    }
    this.publishPayload();
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortedBy, this.sortDirection);
  }

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === 'asc' ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : '';
      b = key(b) ? key(b) : '';
      return isReverse * ((a > b) - (b > a));
    });
    this._filteredAccounts = parsedData;
  }
}
