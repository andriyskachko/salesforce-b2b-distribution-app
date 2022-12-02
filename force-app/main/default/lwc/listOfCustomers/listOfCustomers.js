import { LightningElement, wire } from 'lwc';
import getOpportunitiesSummary from '@salesforce/apex/OpportunityController.getOpportunitiesSummary';

/** @type {FilterOption} */
const ALL = { value: 'ALL', label: 'All' };
/** @type {FilterOption} */
const LAST_WEEK = { value: 'LAST_WEEK', label: 'Last week' };
/** @type {FilterOption} */
const LAST_MONTH = { value: 'LAST_MONTH', label: 'Last month' };
/** @type {FilterOption} */
const LAST_YEAR = { value: 'LAST_YEAR', label: 'Last year' };

/** @type {DatatableColumn[]} */
const COLUMNS = [
  {
    label: 'Customer',
    fieldName: 'accountUrl',
    type: 'url',
    typeAttributes: { label: { fieldName: 'accountName' } },
    target: '_blank',
    sortable: true
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

/** @type {FilterOption[]} */
const FILTER_OPTIONS = [ALL, LAST_WEEK, LAST_MONTH, LAST_YEAR];

export default class ListOfCustomers extends LightningElement {
  /** @type {OpportunitySummaryResultDTO[]} */
  summaryData = [];
  error;
  columns = COLUMNS;
  filterOptions = FILTER_OPTIONS;
  currentFilterValue = ALL.value;
  regionId = 'a013N0000051XDVQA2';

  @wire(getOpportunitiesSummary, {
    regionId: '$regionId',
    closeDateFilter: '$currentFilterValue'
  })
  wiredSummaryData({ error, data }) {
    if (data) {
      this.summaryData = data;
      this.error = undefined;
      console.log(this.summaryData);
    } else if (error) {
      this.summaryData = [];
      this.error = error;
      console.log(this.error);
    }
  }
}
