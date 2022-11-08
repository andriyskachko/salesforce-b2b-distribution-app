trigger CreateWarehouse on Warehouse__c(after insert) {
  WarehouseTriggerController.insertLocationsForWarehouses(Trigger.new);
}
