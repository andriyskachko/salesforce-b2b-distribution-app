trigger Account on Account(after insert, after update) {
  AccountHandler.updateSalesManagerForAccountsOpportunities(
    Trigger.new,
    Trigger.oldMap
  );
}
