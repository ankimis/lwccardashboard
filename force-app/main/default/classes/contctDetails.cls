public with sharing class contctDetails {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getAllContacts(String name) {
        try {
            if(String.isBlank(name)) {
                   return [SELECT Id, FirstName, Email FROM Contact where FirstName LIKE :('%' + name + '%') lIMIT 10];

        } else {
            return [SELECT Id, Name, Email FROM Contact LIMIT 10];
        }
        } catch (Exception e) {
             throw new AuraHandledException('Error fetching contacts: ' + e.getMessage());
        }        
        
    }
    // delete contact method
    @AuraEnabled
    public static void deleteContactById(Id contactId) {
        try {
            Contact con = [SELECT Id FROM Contact WHERE Id = :contactId LIMIT 1];
            delete con;
        } catch (Exception e) {
            throw new AuraHandledException('Error deleting contact: ' + e.getMessage());    
        }
    }
    //get record by id
    @AuraEnabled(cacheable=true)
    public static Contact getContactById(Id contactId) {
        try {
            return [SELECT Id, FirstName, Email FROM Contact WHERE Id = :contactId LIMIT 1];
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching contact: ' + e.getMessage());    
        }   
    }
    // update contact method
   @AuraEnabled
    public static void updateContact(Id contactId, String name, String email) {
        try {
            Contact contact = [SELECT Id, FirstName, Email FROM Contact WHERE Id = :contactId LIMIT 1];
        contact.FirstName = name;
        contact.Email = email;
        update contact;
        } catch (Exception e) {
            throw new AuraHandledException('Error updating contact: ' + e.getMessage());
        }
    }
}