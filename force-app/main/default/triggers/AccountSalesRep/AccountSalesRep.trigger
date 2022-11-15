trigger AccountSalesRep on Account(after update) {
  AccountSalesRepTriggerController.updateSalesManagerForAccountsOpportunities(
    Trigger.new
  );
}
