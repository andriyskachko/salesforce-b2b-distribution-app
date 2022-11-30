global with sharing class ScheduledRegionalManagerReminder implements Schedulable {
  global void execute(SchedulableContext sc) {
    RemindRegionalManagers remindRegionalManagers = new RemindRegionalManagers();
    remindRegionalManagers.sendCustomNotificationToRegionalManagers();
  }
}
