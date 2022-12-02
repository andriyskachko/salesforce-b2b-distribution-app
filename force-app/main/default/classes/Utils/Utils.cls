public with sharing class Utils {
  public static String getRecordUrL(String id) {
    return URL.getSalesforceBaseUrl().toExternalForm() + '/' + id;
  }

  private static Map<String, Date> getDateRangeMap(Date startsAt, Date endsAt) {
    Map<String, Date> dateRangeMap = new Map<String, Date>();

    dateRangeMap.put('startsAt', startsAt);
    dateRangeMap.put('endsAt', endsAt);

    return dateRangeMap;
  }

  public static Map<String, Date> getDateRangeFromDateLiteral(String literal) {
    switch on literal {
      when 'LAST_WEEK' {
        Date startsAt = Date.today().toStartOfWeek() - 6;
        Date endsAt = Date.today().toStartOfWeek();
        return Utils.getDateRangeMap(startsAt, endsAt);
      }
      when 'LAST_MONTH' {
        Date startsAt = Date.today().toStartOfMonth().addMonths(-1);
        Date endsAt = startsAt.addMonths(1).toStartofMonth().addDays(-1);
        return Utils.getDateRangeMap(startsAt, endsAt);
      }
      when 'LAST_YEAR' {
        Integer lastYear = Date.today().year() - 1;
        Date startsAt = Date.valueOf(lastYear + '-01-01');
        Date endsAt = Date.valueOf(lastYear + '-12-31');
        return Utils.getDateRangeMap(startsAt, endsAt);
      }
      when else {
        return Utils.getDateRangeMap(Date.valueOf('1700-01-01'), Date.today());
      }
    }
  }

  public static String getStringValue(Object obj) {
    if (obj == null) {
      return '';
    }
    return String.valueOf(obj);
  }

  public static Integer getIntegerValue(Object obj) {
    if (obj == null) {
      return 0;
    }
    return Integer.valueOf(Utils.getStringValue(obj));
  }
}
