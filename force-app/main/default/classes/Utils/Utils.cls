public with sharing class Utils {
  public static String getRecordUrL(String id) {
    return URL.getSalesforceBaseUrl().toExternalForm() + '/' + id;
  }

  public static void sendCustomNotification(NotificationReminder reminder) {
    Messaging.CustomNotification notification = new Messaging.CustomNotification();
    notification.setTitle(reminder.title);
    notification.setBody(reminder.body);
    notification.setNotificationTypeId(reminder.notificationType.Id);
    notification.setSenderId(reminder.senderId);
    notification.setTargetId(reminder.targetId);
    try {
      notification.send(reminder.recipientsIds);
    } catch (Exception e) {
      System.debug('Problem sending notification: ' + e.getMessage());
    }
  }
}
