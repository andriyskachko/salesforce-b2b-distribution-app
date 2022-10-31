trigger CreateWarehouse on Warehouse__c(after insert) {
  WarehouseController.insertLocationsForWarehouses(Trigger.new);
}
