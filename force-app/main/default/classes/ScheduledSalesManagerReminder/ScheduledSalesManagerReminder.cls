global with sharing class ScheduledSalesManagerReminder implements Schedulable {
  global void execute(SchedulableContext sc) {
    RemindSalesManagers.sendCustomNotificationToSalesManagers();
  }
}
