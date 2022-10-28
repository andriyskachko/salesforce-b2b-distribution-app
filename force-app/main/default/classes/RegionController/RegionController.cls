public with sharing class RegionController {
  @AuraEnabled(cacheable=true)
  public static List<Region__c> getRegions() {
    return [
      SELECT Id, Name
      FROM Region__c
      WITH SECURITY_ENFORCED
      ORDER BY Name
    ];
  }
}
