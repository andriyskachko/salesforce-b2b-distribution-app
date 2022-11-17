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

  @AuraEnabled
  public static List<Opportunity> getOpportunitiesForAccounts(
    List<String> accountIds
  ) {
    List<Opportunity> lstOpps = new List<Opportunity>();

    for (Account a : [
      SELECT
        Id,
        Name,
        (SELECT Id, Name, StageName, Account.Name, AccountId FROM Opportunities)
      FROM Account
      WHERE Id IN :accountIds
      WITH SECURITY_ENFORCED
      LIMIT 5000
    ]) {
      if (a.Opportunities.size() > 0) {
        for (Opportunity o : a.Opportunities) {
          AccountOpportunityDTO acctOppDTO = new AccountOpportunityDTO();
          acctOppDTO.id = o.Id;
          acctOppDTO.name = o.Name;
          acctOppDTO.url = Utils.getRecordUrL(o.Id);
          acctOppDTO.stage = o.StageName;
          acctOppDTO.accountName = o.Account.Name;
          acctOppDTO.accountUrl = Utils.getRecordUrL(o.AccountId);
        }
      }
    }

    return lstOpps;
  }
}
