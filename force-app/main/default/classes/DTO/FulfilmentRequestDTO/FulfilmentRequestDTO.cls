public with sharing class FulfilmentRequestDTO {
  @AuraEnabled
  public String requestId;
  @AuraEnabled
  public String requestUrl;
  @AuraEnabled
  public String requestName;
  @AuraEnabled
  public String assignedTo;
  @AuraEnabled
  public String assignedToUrl;
  @AuraEnabled
  public String fullfilled;
  @AuraEnabled
  public Date dueDate;
  @AuraEnabled
  public Datetime createdAt;
  @AuraEnabled
  public String status;
}
