trigger CreateWarehouse on Warehouse__c(after insert) {
  for (Warehouse__c w : Trigger.new) {
    Schema.Location location = new Schema.Location();
    location.Name = w.Name + ' Location';
    location.LocationType = 'Warehouse';
    location.isInventoryLocation = true;
    insert location;
    WarehouseController.updateWarehouseLocationId(w.Id, location.Id);
    System.debug('Successfully created location on ' + w.Name);
  }
}
