public with sharing class RemindSalesManagers {
  private static final Integer DAYS_CAP = 21;

  public static void sendCustomNotificationToSalesManagers() {
    String developerName = 'Sales_Manager_Customer_Has_Not_Been_Contacted_Notification';

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

    CustomNotifications.ReminderNotification reminderNotification = new CustomNotifications.ReminderNotification();
    reminderNotification.title = 'Contact a Customer who has not been contacted in 3 weeks!';
    reminderNotification.body = 'A Customer has not been contacted for 3 or more weeks, please review.';

    CustomNotifications.sendCustomerReminders(
      developerName,
      reminderNotification,
      lstAccount
    );
  }
}
