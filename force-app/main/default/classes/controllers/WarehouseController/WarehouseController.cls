public with sharing class WarehouseController {
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
      fulfilmentReqDTO.requestUrl =
        URL.getSalesforceBaseUrl().toExternalForm() +
        '/' +
        f.Id;
      fulfilmentReqDTO.assignedToUrl =
        URL.getSalesforceBaseUrl().toExternalForm() +
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

  @AuraEnabled(cacheable=true)
  public static List<ProductItemDTO> getProductItemsInWarehouse(
    String warehouseId
  ) {
    Id locationId = WarehouseController.getWarehouseLocationId(warehouseId);

    if (locationId == null) {
      return null;
    }

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
      LIMIT 10
    ];

    List<ProductItemDTO> lstProductItemDTO = new List<ProductItemDTO>();

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
          URL.getSalesforceBaseUrl().toExternalForm() +
          '/' +
          productItem.productId;
        productItem.productItemUrl =
          URL.getSalesforceBaseUrl().toExternalForm() +
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
