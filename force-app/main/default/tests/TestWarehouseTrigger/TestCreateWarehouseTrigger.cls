@isTest
private class TestCreateWarehouseTrigger {
  @isTest
  static void testCreateWarehouse() {
    Warehouse__c warehouse = new Warehouse__c();
    warehouse.Name = 'Test Warehouse';
    Database.SaveResult result = Database.insert(warehouse, false);
    List<Schema.Location> lstLocations = [
      SELECT Id, Name, LocationType, IsInventoryLocation
      FROM Location
    ];
    System.assert(result.isSuccess());
    System.assert(result.getErrors().size() == 0);
    System.assertEquals(1, lstLocations.size());
    System.assertEquals(lstLocations[0].isInventoryLocation, true);
    System.assertEquals(lstLocations[0].LocationType, 'Warehouse');
    System.assertEquals(lstLocations[0].Name, warehouse.Name + ' Location');
  }
}
