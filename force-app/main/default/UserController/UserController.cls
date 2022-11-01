public with sharing class UserController {
  @AuraEnabled(cacheable=true)
  public static List<UserDTO> getUsersBySearchKey(String searchKey) {
    String searchKeyword = '%' + searchKey + '%';
    List<UserDTO> lstUsers = new List<UserDTO>();

    for (User u : [
      SELECT Id, Name
      FROM User
      WHERE Name LIKE :searchKeyword
      WITH SECURITY_ENFORCED
    ]) {
      UserDTO userDTO = new UserDTO();
      userDTO.id = u.Id;
      userDTO.name = u.Name;
      lstUsers.add(userDTO);
    }

    if (lstUsers.size() == 0) {
      throw new AuraHandledException('No Records Found.');
    }

    return lstUsers;
  }
}
