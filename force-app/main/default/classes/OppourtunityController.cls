public with sharing class OppourtunityController {
     // Method to fetch opportunities by stage
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        return [SELECT Id, Name, Amount, CloseDate, StageName 
                FROM Opportunity 
        ];
    }   
}