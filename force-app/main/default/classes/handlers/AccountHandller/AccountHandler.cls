public with sharing class AccountHandler {
  public static void updateAccountsAndRelatedOpportunitites(
    List<Account> newAccounts,
    Map<Id, Account> oldAccountsMap
  ) {
    List<Account> lstAccounts = [
      SELECT
        Sales_ManagerId__c,
        Assigned_ById__c,
        Assigned_At__c,
        LastModifiedById,
        (SELECT Id, Sales_ManagerId__c FROM Opportunities)
      FROM Account
      WHERE Id IN :newAccounts
      WITH SECURITY_ENFORCED
    ];

    if (lstAccounts.size() == 0) {
      return;
    }

    List<Account> updatedAccounts = new List<Account>();
    List<Opportunity> updatedOpportunities = new List<Opportunity>();

    for (Account a : lstAccounts) {
      Account oldAccount = oldAccountsMap.get(a.Id);

      if (
        a.Sales_ManagerId__c == null ||
        oldAccount.Sales_ManagerId__c == a.Sales_ManagerId__c
      ) {
        continue;
      }

      a.Assigned_ById__c = a.LastModifiedById;
      a.Assigned_At__c = System.now();

      updatedAccounts.add(a);

      for (Opportunity o : a.Opportunities) {
        if (o.Sales_ManagerId__c == null) {
          o.Sales_ManagerId__c = a.Sales_ManagerId__c;
        } else if (o.RegionId__c == null || o.RegionId__c != a.Region__c) {
          o.RegionId__c = a.Region__c;
        }
        updatedOpportunities.add(o);
      }
    }

    update updatedAccounts;
    update updatedOpportunities;
  }
}
