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
