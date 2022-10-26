public with sharing class WarehouseController {
  public static void updateWarehouseLocationId(Id warehouseId, Id locationId) {
    Warehouse__c warehouse = [
      SELECT Name, LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];
    warehouse.LocationId__c = locationId;
    update warehouse;
  }

  @AuraEnabled(cacheable=true)
  public static List<Warehouse__c> getWarehousesByRegionId(String regionId) {
    return [
      SELECT Id, Name
      FROM Warehouse__c
      WHERE RegionId__c = :regionId
      WITH SECURITY_ENFORCED
      ORDER BY NAME
    ];
  }

  @AuraEnabled
  public static List<ProductItem> getProductsByWarehouseId(String warehouseId) {
  }
}
