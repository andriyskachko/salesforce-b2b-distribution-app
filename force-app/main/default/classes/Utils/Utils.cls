public with sharing class Utils {
  public static String getRecordUrL(String id) {
    return URL.getSalesforceBaseUrl().toExternalForm() + '/' + id;
  }
}
