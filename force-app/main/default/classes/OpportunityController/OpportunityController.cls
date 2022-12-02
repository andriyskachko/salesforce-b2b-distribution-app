public with sharing class OpportunityController {
  @AuraEnabled(cacheable=true)
  public static List<OpportunitySummaryResultDTO> getOpportunitiesSummary(
    String regionId,
    String closeDateFilter
  ) {
    List<OpportunitySummaryResultDTO> lstResults = new List<OpportunitySummaryResultDTO>();

    Map<String, Date> dateRangeMap = Utils.getDateRangeFromDateLiteral(
      closeDateFilter
    );
    Date startsAt = dateRangeMap.get('startsAt');
    Date endsAt = dateRangeMap.get('endsAt');

    for (AggregateResult ar : [
      SELECT
        AccountId,
        Account.Name,
        SUM(TotalOpportunityQuantity) totalQuantity,
        SUM(Amount) totalAmount
      FROM Opportunity
      WHERE
        CloseDate >= :startsAt
        AND CloseDate <= :endsAt
        AND RegionId__c = :regionId
      WITH SECURITY_ENFORCED
      GROUP BY AccountId, Account.Name
      LIMIT 5000
    ]) {
      OpportunitySummaryResultDTO result = new OpportunitySummaryResultDTO();
      result.accountName = Utils.getStringValue(ar.get('Name'));

      result.accountUrl = Utils.getRecordUrL(
        Utils.getStringValue(ar.get('AccountId'))
      );

      result.totalQuantity = Utils.getIntegerValue(ar.get('totalQuantity'));
      result.totalAmount = Utils.getIntegerValue(ar.get('totalAmount'));
      lstResults.add(result);
    }

    return lstResults;
  }
}
