trigger Warehouse on Warehouse__c(after insert) {
  WarehouseHandler.insertLocationsForWarehouses(Trigger.new);
}
