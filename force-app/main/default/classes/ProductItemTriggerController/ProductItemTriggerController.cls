public with sharing class ProductItemTriggerController {
  public static void validateProductExistanceInInventory(
    List<ProductItem> lstProductItemOnTrigger
  ) {
    Map<Id, Id> mapNewProductToLocation = new Map<Id, Id>();
    Map<Id, List<ProductItem>> mapLocationProduct = new Map<Id, List<ProductItem>>();

    for (ProductItem p : lstProductItemOnTrigger) {
      mapNewProductToLocation.put(p.LocationId, p.Product2Id);
    }

    for (Schema.Location l : [
      SELECT Id, (SELECT Product2Id FROM ProductItems)
      FROM Location
      WHERE Id IN :mapNewProductToLocation.keySet()
      WITH SECURITY_ENFORCED
    ]) {
      mapLocationProduct.put(l.Id, l.ProductItems);
    }

    for (ProductItem p : lstProductItemOnTrigger) {
      List<ProductItem> lstOldProductItem = mapLocationProduct.get(
        p.LocationId
      );
      if (
        ProductItemTriggerController.productExistsInLocationProductItems(
          p.Product2Id,
          lstOldProductItem
        ) == true
      ) {
        p.addError('Such product already exists in the Location inventory.');
      }
    }
  }

  private static Boolean productExistsInLocationProductItems(
    Id product2Id,
    List<ProductItem> lstProductItem
  ) {
    if (lstProductItem == null) {
      return false;
    }

    Set<Id> setProductId = new Set<Id>();

    for (ProductItem p : lstProductItem) {
      setProductId.add(p.Product2Id);
    }

    return setProductId.contains(product2Id);
  }
}
