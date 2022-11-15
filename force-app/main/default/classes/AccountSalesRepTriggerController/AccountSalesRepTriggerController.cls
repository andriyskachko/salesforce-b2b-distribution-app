public with sharing class AccountSalesRepTriggerController {
  private static List<Opportunity> getUpdatedSalesManagerForAccountOpportunities(
    Id accountId
  ) {
    List<Account> lstAccount = [
      SELECT Id, Sales_ManagerId__c
      FROM Account
      WHERE Id = :accountId
      WITH SECURITY_ENFORCED
    ];

    if (lstAccount.size() == 0) {
      return null;
    }

    Id salesRepId = lstAccount[0].Sales_ManagerId__c;

    List<Opportunity> updatedOpportunities = new List<Opportunity>();

    for (Opportunity o : [
      SELECT Id, Sales_ManagerId__c
      FROM Opportunity
      WHERE AccountId = :accountId
      WITH SECURITY_ENFORCED
    ]) {
      if (o.Sales_ManagerId__c == null) {
        o.Sales_ManagerId__c = salesRepId;
        updatedOpportunities.add(o);
      }
    }

    return updatedOpportunities;
  }

  public static void updateSalesManagerForAccountsOpportunities(
    List<Account> accounts
  ) {
    List<Opportunity> updatedOpportunities = new List<Opportunity>();
    for (Account a : accounts) {
      List<Opportunity> updatedOpps = AccountSalesRepTriggerController.getUpdatedSalesManagerForAccountOpportunities(
        a.Id
      );
      updatedOpportunities.addAll(updatedOpps);
    }

    update updatedOpportunities;
  }
}
