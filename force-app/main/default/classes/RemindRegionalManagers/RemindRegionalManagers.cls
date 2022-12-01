public with sharing class RemindRegionalManagers {
  // private static final Integer DAYS_CAP = 28;

  // public static void sendCustomNotificationToRegionalManagers() {
  //   String developerName = 'Regional_Manager_Customer_Hasnt_Been_Contacted_For_Month';

  //   CustomNotificationType notificationType = [
  //     SELECT Id, DeveloperName
  //     FROM CustomNotificationType
  //     WHERE DeveloperName = :developerName
  //     WITH SECURITY_ENFORCED
  //   ];

  //   if (notificationType == null) {
  //     return;
  //   }

  //   List<Account> lstAccount = [
  //     SELECT
  //       Id,
  //       Name,
  //       OwnerId,
  //       Sales_ManagerId__c,
  //       Days_Since_Last_Opportunity_Created__c,
  //       Days_Since_Last_Activity__c
  //     FROM Account
  //     WHERE
  //       Days_Since_Last_Opportunity_Created__c >= :RemindRegionalManagers.DAYS_CAP
  //       OR Days_Since_Last_Activity__c >= :RemindRegionalManagers.DAYS_CAP
  //     WITH SECURITY_ENFORCED
  //     LIMIT 5000
  //   ];

  //   for (Account a : lstAccount) {
  //     NotificationReminder reminder = new NotificationReminder();
  //     reminder.title = 'A has not been contacted in 1 month!';
  //     reminder.body =
  //       'The Customer' +
  //       a.Name +
  //       'has not been contacted or made any orders for 1 or more months.';
  //     reminder.notificationType = notificationType;
  //     reminder.senderId = a.OwnerId;
  //     reminder.targetId = a.Id;
  //     reminder.recipientsIds = new Set<String>{ a.Sales_ManagerId__c }; // Change to Regional Manager

  //     Utils.sendCustomNotification(reminder);
  //   }
  // }
}
