public with sharing class CustomNotifications {
  private class Notification {
    public String title;
    public String body;
    public CustomNotificationType notificationType;
    public String senderId;
    public String targetId;
    public Set<String> recipientsId;
  }

  public class ReminderNotification {
    public String title;
    public String body;
  }

  private static CustomNotificationType getCustomNotificationByDeveloperName(
    String developerName
  ) {
    List<CustomNotificationType> lstNotificationType = [
      SELECT Id
      FROM CustomNotificationType
      WHERE DeveloperName = :developerName
      WITH SECURITY_ENFORCED
    ];

    if (lstNotificationType.size() == 0) {
      return null;
    }

    CustomNotificationType notificationType = lstNotificationType[0];

    return notificationType;
  }

  private static void sendCustomNotification(
    CustomNotifications.Notification notification
  ) {
    Messaging.CustomNotification customNotification = new Messaging.CustomNotification();
    customNotification.setTitle(notification.title);
    customNotification.setBody(notification.body);
    customNotification.setNotificationTypeId(notification.notificationType.Id);
    customNotification.setSenderId(notification.senderId);
    customNotification.setTargetId(notification.targetId);
    try {
      customNotification.send(notification.recipientsId);
    } catch (Exception e) {
      System.debug('Problem sending notification: ' + e.getMessage());
    }
  }

  public static void sendCustomerReminders(
    String developerName,
    ReminderNotification reminderNotification,
    List<Account> lstAccount
  ) {
    CustomNotificationType notificationType = CustomNotifications.getCustomNotificationByDeveloperName(
      developerName
    );

    if (notificationType == null) {
      return;
    }

    for (Account a : lstAccount) {
      CustomNotifications.Notification notification = new CustomNotifications.Notification();
      notification.title = reminderNotification.title;
      notification.body = reminderNotification.body;
      notification.notificationType = notificationType;
      notification.senderId = a.OwnerId;
      notification.targetId = a.Id;
      notification.recipientsId = new Set<String>{ a.Sales_ManagerId__c }; // TODO: make it grab either Regional Manager or Sales Manager
      CustomNotifications.sendCustomNotification(notification);
    }
  }
}
