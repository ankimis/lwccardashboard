public with sharing class casesopen {     

    @AuraEnabled(cacheable=true)
    public static List<Case> getOpenCases() {
        return [SELECT Id, CaseNumber, Subject, Status FROM Case WHERE Status = 'Open' ORDER BY CreatedDate DESC LIMIT 50];
    }
}