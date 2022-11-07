public with sharing class WarehouseTriggerController {
  private static Warehouse__c updateWarehouseLocationId(
    Id warehouseId,
    Id locationId
  ) {
    Warehouse__c warehouse = [
      SELECT LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];
    warehouse.LocationId__c = locationId;
    return warehouse;
  }

  public static void insertLocationsForWarehouses(
    List<Warehouse__c> lstWarehouses
  ) {
    Map<Id, Schema.Location> mapWarehouseToLocation = new Map<Id, Schema.Location>();
    List<Schema.Location> lstLocations = new List<Schema.Location>();
    List<Warehouse__c> lstUpdatedWarehouses = new List<Warehouse__c>();
    for (Warehouse__c w : lstWarehouses) {
      Schema.Location location = new Schema.Location();
      location.Name = w.Name + ' Location';
      location.LocationType = 'Warehouse';
      location.isInventoryLocation = true;
      lstLocations.add(Location);
      mapWarehouseToLocation.put(w.Id, location);
    }

    insert lstLocations;

    for (Id warehouseId : mapWarehouseToLocation.keySet()) {
      Schema.Location location = mapWarehouseToLocation.get(warehouseId);
      Warehouse__c updatedWarehouse = WarehouseTriggerController.updateWarehouseLocationId(
        warehouseId,
        location.Id
      );
      lstUpdatedWarehouses.add(updatedWarehouse);
    }

    update lstUpdatedWarehouses;
  }
}
