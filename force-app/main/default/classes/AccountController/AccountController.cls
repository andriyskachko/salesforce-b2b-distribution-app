public with sharing class AccountController {
  @AuraEnabled(cacheable=true)
  public static List<AccountDTO> getSalesManagerAssignedCustomers(
    String userId
  ) {
    List<AccountDTO> lstAcct = new List<AccountDTO>();

    for (Account a : [
      SELECT
        Id,
        Name,
        Assigned_ById__c,
        Assigned_ById__r.Name,
        Assigned_At__c,
        YearStarted,
        Last_Contacted_At__c
      FROM Account
      WHERE Sales_ManagerId__c = :userId
      WITH SECURITY_ENFORCED
      LIMIT 5000
    ]) {
      AccountDTO acct = new AccountDTO();
      acct.id = a.Id;
      acct.name = a.Name;
      acct.url = URL.getSalesforceBaseUrl().toExternalForm() + '/' + a.Id;
      acct.assignedBy = a.Assigned_ById__r.Name != null
        ? a.Assigned_ById__r.Name
        : '';
      acct.assignedByUrl = a.Assigned_ById__c != null
        ? URL.getSalesforceBaseUrl().toExternalForm() + '/' + a.Assigned_ById__c
        : '';
      acct.assignedAt = String.valueOfGmt(a.Assigned_At__c);
      acct.lastContactedAt = String.valueOfGmt(a.Last_Contacted_At__c);
      acct.yearStarted = a.YearStarted;
      lstAcct.add(acct);
    }

    if (lstAcct.size() == 0) {
      return null;
    }

    return lstAcct;
  }
}
