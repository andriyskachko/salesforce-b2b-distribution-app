public with sharing class RemindSalesManagers {
  private static final Integer DAYS_CAP = 21;

  public void sendCustomNotificationToSalesManagers() {
    String developerName = 'Sales_Manager_Customer_Has_Not_Been_Contacted_Notification';

    CustomNotificationType notificationType = [
      SELECT Id, DeveloperName
      FROM CustomNotificationType
      WHERE DeveloperName = :developerName
      WITH SECURITY_ENFORCED
    ];

    if (notificationType == null) {
      return;
    }

    List<Account> lstAccount = [
      SELECT
        Id,
        Name,
        OwnerId,
        Sales_ManagerId__c,
        Days_Since_Last_Opportunity_Created__c,
        Days_Since_Last_Activity__c
      FROM Account
      WHERE
        Sales_ManagerId__c != NULL
        AND (Days_Since_Last_Opportunity_Created__c >= :RemindSalesManagers.DAYS_CAP
        OR Days_Since_Last_Activity__c >= :RemindSalesManagers.DAYS_CAP)
      WITH SECURITY_ENFORCED
      LIMIT 5000
    ];

    for (Account a : lstAccount) {
      NotificationReminder reminder = new NotificationReminder();
      reminder.title = 'Contact a Customer who has not been contacted in 3 weeks!';
      reminder.body =
        'The Customer' +
        a.Name +
        'has not been contacted for 3 or more weeks.';
      reminder.notificationType = notificationType;
      reminder.senderId = a.OwnerId;
      reminder.targetId = a.Id;
      reminder.recipientsIds = new Set<String>{ a.Sales_ManagerId__c };

      Utils.sendCustomNotification(reminder);
    }
  }
}
