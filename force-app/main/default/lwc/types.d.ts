interface RegionDTO {
  name: string;
  id: string;
  regionalManagerId: string;
  regionalManagerName: string;
}

interface WarehouseDTO {
  name: string;
  id: string;
}

interface Option {
  value: string;
  label: string;
}

interface User {
  name: string;
  id: string;
}

interface WarehousePayload {
  warehouseId: string;
}

interface RegionPayload {
  regionId: string;
}

interface AccountsPayload {
  lstAccountId: string[];
}

interface ProductItemDTO {
  productItemId: string;
  productItemUrl: string;
  productId: string;
  productName: string;
  productUrl: string;
  productItemNumber: string;
  productItemQuantity: number;
  productItemSerialNumber: string;
}

interface DatatableColumn {
  label: string;
  fieldName: string;
  type: string;
  typeAttributes?: TypeAttributes;
  target?: string;
  sortable?: boolean;
}

interface TypeAttributes {
  label: Label;
}

interface Label {
  fieldName: string;
}

interface FulfilmentRequestDTO {
  requestId: string;
  requestUrl: string;
  requestName: string;
  assignedTo: string;
  assignedToUrl: string;
  fulfilled: 'Yes' | 'No';
  dueDate: Date;
  createdAt: Date;
  status: 'New' | 'In Process' | 'Completed';
}

interface Prop {
  fieldName: string;
  value: string;
  displayValue?: string;
}

interface AccountDTO {
  id: string;
  name: string;
  url: string;
  assignedBy: string;
  assignedByUrl: string;
  assignedAt: string;
  lastContactedAt: string;
  yearStarted: string;
}
