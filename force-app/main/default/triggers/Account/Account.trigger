trigger Account on Account(after insert, after update) {
  AccountHandler.updateAccountsAndRelatedOpportunitites(
    Trigger.new,
    Trigger.oldMap
  );
}
