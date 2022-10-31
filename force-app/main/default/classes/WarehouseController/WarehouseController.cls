public with sharing class WarehouseController {
  public static Warehouse__c updateWarehouseLocationId(
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
    Warehouse__c warehouse = [
      SELECT LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];

    if (warehouse == null) {
      return null;
    }

    Id locationId = warehouse.LocationId__c;

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

  @AuraEnabled(cacheable=true)
  public static List<Fulfilment_Request__c> getFulfilmentRequestsByWarehouseId(
    String warehouseId
  ) {
    Id locationId = [
      SELECT LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
    ]
    .LocationId__c;

    List<Fulfilment_Request__c> lstFulfilmentReq = [
      SELECT Id, Name, Assigned_To__c, Fulfilled__c, Due_Date__c
      FROM Fulfilment_Request__c
      WHERE LocationId__c = :locationId
      WITH SECURITY_ENFORCED
      ORDER BY Due_Date__c DESC
    ];

    return lstFulfilmentReq;
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
      Warehouse__c updatedWarehouse = WarehouseController.updateWarehouseLocationId(
        warehouseId,
        location.Id
      );
      lstUpdatedWarehouses.add(updatedWarehouse);
    }

    update lstUpdatedWarehouses;
  }
}
