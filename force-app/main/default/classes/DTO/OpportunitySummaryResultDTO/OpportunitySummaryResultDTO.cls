public with sharing class OpportunitySummaryResultDTO {
  @AuraEnabled
  public String id;
  @AuraEnabled
  public String accountName;
  @AuraEnabled
  public String accountUrl;
  @AuraEnabled
  public Integer totalQuantity;
  @AuraEnabled
  public Integer totalAmount;
}
