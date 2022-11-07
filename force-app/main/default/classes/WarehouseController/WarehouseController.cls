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
  public static List<WarehouseDTO> getWarehousesInRegion(String regionId) {
    List<WarehouseDTO> lstWarehouseDTO = new List<WarehouseDTO>();
    for (Warehouse__c w : [
      SELECT Id, Name
      FROM Warehouse__c
      WHERE RegionId__c = :regionId
      WITH SECURITY_ENFORCED
      ORDER BY NAME
    ]) {
      WarehouseDTO warehouseDTO = new WarehouseDTO();
      warehouseDTO.id = w.Id;
      warehouseDTO.name = w.Name;
      lstWarehouseDTO.add(warehouseDTO);
    }

    return lstWarehouseDTO;
  }

  @AuraEnabled(cacheable=true)
  public static WarehouseDTO getWarehouseInfoById(String warehouseId) {
    Warehouse__c warehouse = [
      SELECT Id, Name, LocationId__c, LocationId__r.Name
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
      LIMIT 1
    ];

    if (warehouse == null) {
      return null;
    }

    WarehouseDTO warehouseDTO = new WarehouseDTO();
    warehouseDTO.id = warehouse.Id;
    warehouseDTO.name = warehouse.Name;
    warehouseDTO.locationId = warehouse.LocationId__c;
    warehouseDTO.locationName = warehouse.LocationId__r.Name;
    warehouseDTO.locationUrl =
      URL.getSalesforceBaseUrl() +
      '/' +
      warehouse.LocationId__c;
    return warehouseDTO;
  }

  @AuraEnabled(cacheable=true)
  public static List<FulfilmentRequestDTO> getFulfilmentRequestsByWarehouseId(
    String warehouseId
  ) {
    Id locationId = WarehouseController.getWarehouseLocationId(warehouseId);

    if (locationId == null) {
      return null;
    }

    List<FulfilmentRequestDTO> lstFulfilmentRequestDTO = new List<FulfilmentRequestDTO>();

    for (Fulfilment_Request__c f : [
      SELECT
        Id,
        Name,
        Assigned_To__c,
        Assigned_To__r.Name,
        Fulfilled__c,
        Due_Date__c,
        Status__c,
        CreatedDate
      FROM Fulfilment_Request__c
      WHERE LocationId__c = :locationId
      WITH SECURITY_ENFORCED
      ORDER BY CreatedDate DESC
    ]) {
      FulfilmentRequestDTO fulfilmentReqDTO = new FulfilmentRequestDTO();
      fulfilmentReqDTO.requestId = f.Id;
      fulfilmentReqDTO.requestName = f.Name;
      fulfilmentReqDTO.requestUrl = URL.getSalesforceBaseUrl() + '/' + f.Id;
      fulfilmentReqDTO.assignedToUrl =
        URL.getSalesforceBaseUrl() +
        '/' +
        f.Assigned_To__c;
      fulfilmentReqDTO.assignedTo = f.Assigned_To__r.Name;
      fulfilmentReqDTO.fullfilled = f.Fulfilled__c ? 'Yes' : 'No';
      fulfilmentReqDTO.status = f.Status__c;
      fulfilmentReqDTO.createdAt = f.CreatedDate;
      lstFulfilmentRequestDTO.add(fulfilmentReqDTO);
    }

    return lstFulfilmentRequestDTO;
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

  @AuraEnabled(cacheable=true)
  public static List<ProductItemDTO> getProductItemsInWarehouse(
    String warehouseId
  ) {
    Id locationId = WarehouseController.getWarehouseLocationId(warehouseId);

    if (locationId == null) {
      return null;
    }

    List<ProductItemDTO> lstProductItemDTO = new List<ProductItemDTO>();

    Schema.Location location = [
      SELECT
        Id,
        (
          SELECT
            Id,
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
        ProductItemDTO productItem = new ProductItemDTO();
        productItem.productId = p.Product2.Id;
        productItem.productItemId = p.Id;
        productItem.productItemNumber = p.ProductItemNumber;
        productItem.productItemQuantity = p.QuantityOnHand;
        productItem.productItemSerialNumber = p.SerialNumber;
        productItem.productName = p.Product2.Name;
        productItem.productUrl =
          URL.getSalesforceBaseUrl() +
          '/' +
          productItem.productId;
        productItem.productItemUrl =
          URL.getSalesforceBaseUrl() +
          '/' +
          productItem.productItemId;
        lstProductItemDTO.add(productItem);
      }
    }

    return lstProductItemDTO;
  }

  @AuraEnabled(cacheable=true)
  public static Id getWarehouseLocationId(String warehouseId) {
    List<Warehouse__c> warehouses = [
      SELECT LocationId__c
      FROM Warehouse__c
      WHERE Id = :warehouseId
      WITH SECURITY_ENFORCED
    ];

    if (warehouses.size() == 0) {
      return null;
    }

    Id locationId = warehouses[0].LocationId__c;
    return locationId;
  }
}
