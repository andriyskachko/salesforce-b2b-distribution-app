trigger Opportunity on Opportunity(after insert, after update) {
  List<Opportunity> lstOpps = [
    SELECT Id, Sales_ManagerId__c, Account.Sales_ManagerId__c
    FROM Opportunity
    WHERE Id IN :Trigger.new
    WITH SECURITY_ENFORCED
  ];
  OpportunityHandler.updateSalesRepOnOpportunities(lstOpps);
}
