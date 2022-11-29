public with sharing class SalesManagerCustomerReminderDTO {
  public CustomNotificationType notificationType;
  public String title;
  public String body;
  public Id senderId;
  public Id targetId;
  public Set<String> recipientsIds;
}
