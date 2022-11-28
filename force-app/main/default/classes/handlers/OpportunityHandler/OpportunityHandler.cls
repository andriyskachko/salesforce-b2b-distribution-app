public with sharing class OpportunityHandler {
  private static List<Opportunity> getUpdatedSalesRepOnOpportunities(
    List<Opportunity> opportunities
  ) {
    List<Opportunity> updatedOpps = new List<Opportunity>();
    for (Opportunity o : opportunities) {
      if (
        o.Sales_ManagerId__c == null &&
        o.Account.Sales_ManagerId__c != null
      ) {
        o.Sales_ManagerId__c = o.Account.Sales_ManagerId__c;
        updatedOpps.add(o);
      }
    }

    return updatedOpps;
  }

  public static void updateSalesRepOnOpportunities(
    List<Opportunity> opportunities
  ) {
    List<Opportunity> updatedOpps = OpportunityHandler.getupdatedSalesRepOnOpportunities(
      opportunities
    );
    update updatedOpps;
  }

  public static void updateLastOpportunityDateOnAccounts(
    List<Opportunity> opportunities
  ) {
    List<Account> lstUpdatedAccts = OpportunityHandler.getUpdatedLastOpportunityCreatedOnAccounts(
      opportunities
    );

    update lstUpdatedAccts;
  }

  private static List<Account> getUpdatedLastOpportunityCreatedOnAccounts(
    List<Opportunity> opportunities
  ) {
    Map<Id, Date> mapUpdatedLastOpportunityDates = new Map<Id, Date>();

    for (Opportunity o : opportunities) {
      mapUpdatedLastOpportunityDates.put(o.AccountId, o.CreatedDate);
    }

    List<Id> lstAccountId = mapUpdatedLastOpportunityDates.keySet();

    List<Account> lstUpdatedAccts = [
      SELECT Id, Last_Opportunity_Created_At__c
      FROM Account
      WHERE Id IN :lstAccountId
      WITH SECURITY_ENFORCED
    ];

    for (Account a : lstUpdatedAccts) {
      a.Last_Opportunity_Created_At__c = mapUpdatedLastOpportunityDates.get(
        a.Id
      );
    }

    return updatedAccts;
  }
}
