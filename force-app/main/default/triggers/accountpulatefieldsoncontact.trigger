    trigger accountpulatefieldsoncontact on Account (After update) {
        map<Id,String> accMap = new map<Id,String>();
        for(Account acc:Trigger.new){
            if(acc.Description != Trigger.oldMap.get(acc.Id).Description){
                accMap.put(acc.Id,acc.Description);
            }
        }
        List<Contact> conList = [Select Id, AccountId, Description__c from Contact where AccountId IN :accMap.keySet()];
        for(Contact con:conList){
            con.Description__c = accMap.get(con.AccountId);

        }
        update conList;
}