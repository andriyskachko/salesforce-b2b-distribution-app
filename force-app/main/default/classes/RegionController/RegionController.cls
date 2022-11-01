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

  @AuraEnabled(cacheable=true)
  public static RegionDTO getRegionById(String regionId) {
    Region__c region = [
      SELECT Name, Regional_ManagerId__c, Regional_ManagerId__r.Name
      FROM Region__c
      WHERE Id = :regionId
      WITH SECURITY_ENFORCED
    ];

    if (region == null) {
      return null;
    }

    RegionDTO regionDTO = new RegionDTO();
    regionDTO.id = regionId;
    regionDTO.name = region.Name;
    regionDTO.regionalManagerId = region.Regional_ManagerId__c;
    regionDTO.regionalManagerName = region.Regional_ManagerId__r.Name;

    return regionDTO;
  }
}
