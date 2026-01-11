public with sharing class CsvController {
   //generate CSV from Account records
    @AuraEnabled(cacheable=true)
    public static  List<Schema.Account> generateCsv() {      
        List<Schema.Account> accList = [
            SELECT Id, Name,Phone,AnnualRevenue,Industry FROM Account
        ];

        String csvContent = 'Id,Name,Phone,AnnualRevenue,Industry\n';
        for (Schema.Account acc : accList) {
            csvContent += '"' + acc.Id + '","' + acc.Name + '","' + acc.Phone + '","' + acc.AnnualRevenue + '","' + acc.Industry + '"\n';
        }
      return accList;
       
    }
}