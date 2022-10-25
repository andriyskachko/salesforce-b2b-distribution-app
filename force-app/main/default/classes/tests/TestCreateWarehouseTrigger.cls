public with sharing class WarehouseController {
  public static void updateWarehouseLocationId(Id warehouseId, Id locationId) {
    Warehouse__c warehouse = [
      SELECT Name, LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
      LIMIT 1
    ];
    warehouse.LocationId__c = locationId;
    update warehouse;
  }
}
