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
  public static List<Warehouse__c> getWarehousesInRegion(String regionId) {
    return [
      SELECT Id, Name
      FROM Warehouse__c
      WHERE RegionId__c = :regionId
      WITH SECURITY_ENFORCED
      ORDER BY NAME
    ];
  }

  @AuraEnabled(cacheable=true)
  public static List<ProductItem> getProductItemsInWarehouse(
    String warehouseId
  ) {
    Id locationId = [
      SELECT LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
    ]
    .LocationId__c;

    List<ProductItem> lstProductItem = new List<ProductItem>();

    Schema.Location location = [
      SELECT
        Id,
        (
          SELECT
            Product2.Id,
            Product2.Name,
            ProductItemNumber,
            QuantityOnHand,
            SerialNumber
          FROM ProductItems
        )
      FROM Location
      WHERE Id = :locationId
      WITH SECURITY_ENFORCED
    ];

    if (!location.ProductItems.isEmpty()) {
      for (ProductItem p : location.ProductItems) {
        lstProductItem.add(p);
      }
    }

    return lstProductItem;
  }

  @AuraEnabled(cacheable=true)
  public static Warehouse__c getWarehouseInfoById(String warehouseId) {
    return [
      SELECT Id, Name, LocationId__c, LocationId__r.Name
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];
  }
}
