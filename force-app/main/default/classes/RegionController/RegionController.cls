public with sharing class RegionController {
  @AuraEnabled(cacheable=true)
  public static List<RegionDTO> getRegions() {
    List<RegionDTO> lstRegionDTO = new List<RegionDTO>();
    for (Region__c r : [
      SELECT Id, Name
      FROM Region__c
      WITH SECURITY_ENFORCED
      ORDER BY Name
    ]) {
      RegionDTO regionDTO = new RegionDTO();
      regionDTO.id = r.Id;
      regionDTO.name = r.Name;
      lstRegionDTO.add(regionDTO);
    }
    return lstRegionDTO;
  }
}
