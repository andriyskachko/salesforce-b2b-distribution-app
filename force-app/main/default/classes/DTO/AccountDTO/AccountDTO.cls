public with sharing class AccountDTO {
  @AuraEnabled
  public String id;

  @AuraEnabled
  public String name;

  @AuraEnabled
  public String url;

  @AuraEnabled
  public String assignedBy;

  @AuraEnabled
  public String assignedByUrl;

  @AuraEnabled
  public String assignedAt;

  @AuraEnabled
  public String lastContactedAt;

  @AuraEnabled
  public String yearStarted;
}
