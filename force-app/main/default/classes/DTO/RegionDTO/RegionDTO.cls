public with sharing class RegionDTO {
  @AuraEnabled
  public String id;
  @AuraEnabled
  public String name;
  @AuraEnabled
  public Id regionalManagerId;
  @AuraEnabled
  public String regionalManagerName;
}
