public with sharing class FulfilmentRequestHandler {
  private static Boolean productItemExistsOnLocation(
    Id productItemId,
    Set<Id> setProductItemId
  ) {
    if (setProductItemId == null) {
      return false;
    }
    return setProductItemId.contains(productItemId);
  }

  private static Set<Id> getProductItemsInLocation(Id locationId) {
    Set<Id> setProductItemIds = new Set<Id>();
    for (ProductItem p : [
      SELECT Id
      FROM ProductItem
      WHERE LocationId = :locationId
      WITH SECURITY_ENFORCED
    ]) {
      setProductItemIds.add(p.Id);
    }

    return setProductItemIds;
  }

  public static void validateProductItemExistsOnLocation(
    List<Fulfilment_Request__c> lstRequests
  ) {
    Map<Id, Set<Id>> mapLocationProductItem = new Map<Id, Set<Id>>();

    for (Fulfilment_Request__c f : lstRequests) {
      mapLocationProductItem.put(f.LocationId__c, null);
    }

    for (Schema.Location l : [
      SELECT Id, (SELECT Id FROM ProductItems)
      FROM Location
      WHERE Id IN :mapLocationProductItem.keySet()
      WITH SECURITY_ENFORCED
    ]) {
      Set<Id> setProductItemId = new Set<Id>();

      for (ProductItem p : l.ProductItems) {
        setProductItemId.add(p.Id);
      }

      mapLocationProductItem.put(l.Id, setProductItemId);
    }

    for (Fulfilment_Request__c f : lstRequests) {
      Set<Id> setProductItemId = mapLocationProductItem.get(f.LocationId__c);
      if (
        FulfilmentRequestHandler.productItemExistsOnLocation(
          f.Product_ItemId__c,
          setProductItemId
        ) == false
      ) {
        f.addError(
          'Such Product Item does not exist on the selected Location.'
        );
      }
    }
  }
}
