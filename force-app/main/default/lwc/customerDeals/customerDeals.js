import { LightningElement, wire } from 'lwc';
import getOpportunitiesForAccounts from '@salesforce/apex/AccountController.getOpportunitiesForAccounts';
import {
  subscribe,
  unsubscribe,
  APPLICATION_SCOPE,
  MessageContext
} from 'lightning/messageService';
import AccountSelectedChannel from '@salesforce/messageChannel/AccountSelectedChannel__c';
import OPPORTUNITY_OBJECT from '@salesforce/schema/Opportunity';

/** @type {DatatableColumn[]} */
const COLUMNS = [
  {
    label: 'Opportunity',
    fieldName: 'url',
    type: 'url',
    typeAttributes: { label: { fieldName: 'name' } },
    target: '_blank',
    sortable: true
  },
  {
    label: 'Customer',
    fieldName: 'accountUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'accountName' } },
    target: '_blank',
    sortable: true
  },
  {
    label: 'Stage',
    fieldName: 'stage',
    type: 'text',
    sortable: true
  },
  {
    label: 'Close Date',
    fieldName: 'closeDate',
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

export default class CustomerDeals extends LightningElement {
  objectApiName = OPPORTUNITY_OBJECT.objectApiName;
  /** @type {string[]} */
  accounts = [];
  subscriptions = [];
  /** @type {AccountOpportunityDTO[]} */
  _ongoingOpportunities = [];
  /** @type {AccountOpportunityDTO[]} */
  _opportunities = [];
  /** @type {AccountOpportunityDTO[]} */
  _filteredOpportunities = [];
  error;
  /** @type {string[]} */
  accountIds;
  columns = COLUMNS;
  defaultSortDirection = 'desc';
  sortedBy = '';
  searchString = '';
  _sortDirection = this.defaultSortDirection;
  pageNumber = 0;
  /** @type {AccountDTO[]} */
  pageAccounts = [];
  options = OPTIONS;
  displayAmount = OPTIONS[0].value;
  showClosedOnly = false;

  @wire(getOpportunitiesForAccounts, { accountIds: '$accountIds' })
  wiredOpportunities({ error, data }) {
    if (data) {
      this._opportunities = data;
      this._filteredOpportunities = this.opportunities;
      this.error = undefined;
    } else if (error) {
      this._opportunities = [];
      this._filteredOpportunities = [];
      this.error = error;
    }
  }

  @wire(MessageContext)
  messageConext;

  connectedCallback() {
    this.initSubscriptions();
  }

  disconnectedCallback() {
    this.terminateSubscriptions();
  }

  initSubscriptions() {
    this.subscribeToAccountMessageChannel();
  }

  terminateSubscriptions() {
    this.subscriptions.forEach((sub) => {
      unsubscribe(sub);
    });

    this.subscriptions = [];
  }

  subscribeToAccountMessageChannel() {
    const sub = subscribe(
      this.messageConext,
      AccountSelectedChannel,
      (message) => this.handleAccountsSelected(message),
      { scope: APPLICATION_SCOPE }
    );
    this.subscriptions.push(sub);
  }

  /** @param {AccountsPayload} message */
  handleAccountsSelected(message) {
    const { lstAccountIds } = message;
    this.accountIds = lstAccountIds;
  }

  handleChange() {
    this.showClosedOnly = !this.showClosedOnly;
    this.searchString = '';
    this._filteredOpportunities = this.opportunities;
  }

  handleSort(event) {
    this.sortedBy = event.detail.fieldName;
    this.sortDirection = event.detail.sortDirection;
    this.sortData(this.sortedBy, this.sortDirection);
  }

  /** @type {AccountOpportunityDTO[]} */
  get opportunities() {
    return this.showClosedOnly
      ? this._opportunities.filter((o) =>
          o.stage.toLowerCase().includes('closed')
        )
      : this._opportunities;
  }

  get oppositeSortDirection() {
    return this.sortDirection === 'asc' ? 'desc' : 'asc';
  }

  handleSearch(event) {
    this.searchString = event.detail.value.toLowerCase();
    this._filteredOpportunities = this.opportunities.filter((record) => {
      // eslint-disable-next-line no-unused-vars
      const { id, url, accountUrl, ...recordData } = record;
      const recordString = JSON.stringify(
        Object.values(recordData)
      ).toLowerCase();
      const regex = new RegExp(this.searchString);
      return regex.test(recordString);
    });
  }

  sortData(fieldName, direction) {
    const parsedData = JSON.parse(JSON.stringify(this.data));
    const key = (a) => a[fieldName];
    const isReverse = direction === 'asc' ? 1 : -1;
    parsedData.sort((a, b) => {
      a = key(a) ? key(a) : '';
      b = key(b) ? key(b) : '';
      // @ts-ignore
      return isReverse * ((a > b) - (b > a));
    });
    this._filteredOpportunities = parsedData;
  }

  get sortDirection() {
    return this._sortDirection;
  }

  set sortDirection(value) {
    this._sortDirection = value;
  }

  /** @type {AccountOpportunityDTO[]} */
  get data() {
    return this._filteredOpportunities;
  }
}
