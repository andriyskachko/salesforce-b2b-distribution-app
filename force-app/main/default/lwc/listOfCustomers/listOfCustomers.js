import { LightningElement, wire } from 'lwc';
import getOpportunitiesSummary from '@salesforce/apex/OpportunityController.getOpportunitiesSummary';
import getSalesManagersForOpportunityAccounts from '@salesforce/apex/OpportunityController.getSalesManagersForOpportunityAccounts';

/** @type {Option} */
const ALL = { value: 'ALL', label: 'All' };
/** @type {Option} */
const LAST_WEEK = { value: 'LAST_WEEK', label: 'Last week' };
/** @type {Option} */
const LAST_MONTH = { value: 'LAST_MONTH', label: 'Last month' };
/** @type {Option} */
const LAST_YEAR = { value: 'LAST_YEAR', label: 'Last year' };

/** @type {DatatableColumn[]} */
const COLUMNS = [
  {
    label: 'Customer',
    fieldName: 'accountUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'accountName' } },
    target: '_blank'
  },
  {
    label: 'Total Quantity Ordered',
    fieldName: 'totalQuantity',
    type: 'number'
  },
  {
    label: 'Total Amount',
    fieldName: 'totalAmount',
    type: 'currency'
  }
];

/** @type {Option[]} */
const FILTER_OPTIONS = [ALL, LAST_WEEK, LAST_MONTH, LAST_YEAR];

export default class ListOfCustomers extends LightningElement {
  /** @type {OpportunitySummaryResultDTO[]} */
  _summaryData = [];
  /** @type {AccountSalesManagerDTO[]} */
  salesManagers = [];
  wiredSummaryError;
  wiredSalesManagersError;
  columns = COLUMNS;
  filterOptions = FILTER_OPTIONS;
  closeDateFilter = ALL.value;
  regionId = 'a013N0000051XDVQA2';
  salesManagerId = '';

  @wire(getOpportunitiesSummary, {
    regionId: '$regionId',
    closeDateFilter: '$closeDateFilter',
    salesManagerId: '$salesManagerId'
  })
  wiredSummaryData({ error, data }) {
    if (data) {
      this._summaryData = data;
      this.wiredSummaryError = undefined;
      console.log(this.summaryData);
    } else if (error) {
      this._summaryData = [];
      this.wiredSummaryError = error;
      console.log(this.wiredSummaryError);
    }
  }

  @wire(getSalesManagersForOpportunityAccounts, {
    regionId: '$regionId',
    closeDateFilter: '$closeDateFilter',
    salesManagerId: '$salesManagerId'
  })
  wiredSalesManagers({ error, data }) {
    if (data) {
      this.salesManagers = data;
      this.wiredSalesManagersError = undefined;
      console.log(this.salesManagers);
    } else if (error) {
      this.salesManagers = [];
      this.wiredSalesManagersError = error;
      console.log(this.wiredSalesManagersError);
    }
  }

  get summaryData() {
    return this._summaryData;
  }

  /** @type {Option[]} */
  get salesManagerOptions() {
    return [
      { label: 'All', value: '' },
      ...this.salesManagers.map((s) => ({
        value: s.id,
        label: s.name
      }))
    ];
  }

  handleSalesManagerChange(event) {
    const salesManagerId = event.detail.value;
    this.salesManagerId = salesManagerId;
  }

  handleTimeFrameChange(event) {
    const timeFrame = event.detail.value;
    this.closeDateFilter = timeFrame;
  }
}
