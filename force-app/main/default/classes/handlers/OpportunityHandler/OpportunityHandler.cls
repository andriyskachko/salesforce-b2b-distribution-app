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
}
