public with sharing class CasesOpened {  
    @AuraEnabled
    public static List<Case> getOpenCases() {
        return [SELECT Id, CaseNumber, Subject, Status,Priority FROM Case WHERE Status != 'Open' ORDER BY CreatedDate DESC LIMIT 50];
    } 
        @AuraEnabled
    public static void assignOwner(Id caseId, Id ownerId) {
        Case c = [SELECT Id, OwnerId FROM Case WHERE Id = :caseId LIMIT 1];
        c.OwnerId = ownerId;
        update c;
    }

    @AuraEnabled
    public static void closeCase(Id caseId) {
        Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId LIMIT 1];
        c.Status = 'Closed';
        update c;
    }
    @AuraEnabled(cacheable=true)
    public static Map<String, Integer> getChartData() {
          Map<String, Integer> data = new Map<String, Integer>();
            for (Case c : [SELECT Priority FROM Case ]) {
                if (data.containsKey(c.Priority)) {
                    data.put(c.Priority, data.get(c.Priority) + 1);
                } else {
                    data.put(c.Priority, 1);
                }
            }

            return data;
    }
    @AuraEnabled(cacheable=true)
        public static List<EntityMilestone> getAllMilestones() {
            return [
                SELECT Id, MilestoneTypeId, MilestoneType.Name, TargetDate, CompletionDate, IsViolated
                FROM EntityMilestone
                ORDER BY TargetDate DESC
            ];
        }
}