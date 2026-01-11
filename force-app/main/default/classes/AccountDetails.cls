public with sharing class AccountDetails {
    @AuraEnabled(cacheable=true)
    public static List<AccountWrapper> fetchAccountDetails() {
        List<AccountWrapper> accountWrappers = new List<AccountWrapper>();
        try {
            // CRUD/FLS checks for Account and fields used
            if (!Schema.sObjectType.Account.isAccessible()) {
                throw new AuraHandledException('Insufficient access: Account object not readable.');
            }
            if (!Schema.sObjectType.Account.fields.Name.isAccessible() ||
                !Schema.sObjectType.Account.fields.Type.isAccessible()) {
                throw new AuraHandledException('Insufficient field access on Account (Name/Type).');
            }
            // Relationship checks: ensure access to child objects used for subquery counts
            Boolean canReadContacts = Schema.sObjectType.Contact.isAccessible();
            Boolean canReadCases = Schema.sObjectType.Case.isAccessible();
            Boolean canReadOpps = Schema.sObjectType.Opportunity.isAccessible();

            // Build dynamic query fields based on accessible relationships
            String baseFields = 'Id, Name, Type';
            String subqueries = '';
            if (canReadContacts) subqueries += ',(SELECT Id FROM Contacts)';
            if (canReadCases) subqueries += ',(SELECT Id FROM Cases)';
            if (canReadOpps) subqueries += ',(SELECT Id FROM Opportunities)';

            String soql = 'SELECT ' + baseFields + subqueries + ' FROM Account';
            List<SObject> results = Database.query(soql);
            List<Account> accList = new List<Account>();

         List<SObject> accResults = Database.query(soql);

        for (SObject sobj : accResults) {
            AccountWrapper accWrap = new AccountWrapper();
            
            // Access primitive fields
            accWrap.accName = (String)sobj.get('Name');
            accWrap.accType = (String)sobj.get('Type');

            // Access child relationships
            if (canReadContacts) {
                List<SObject> contacts = (List<SObject>)sobj.getSObjects('Contacts');
                accWrap.contactCount = contacts != null ? contacts.size() : 0;
            }

            if (canReadCases) {
                List<SObject> cases = (List<SObject>)sobj.getSObjects('Cases');
                accWrap.caseCount = cases != null ? cases.size() : 0;
            }

            if (canReadOpps) {
                List<SObject> opps = (List<SObject>)sobj.getSObjects('Opportunities');
                accWrap.opportunityCount = opps != null ? opps.size() : 0;
            }

            accountWrappers.add(accWrap);
        }

        } catch (Exception e) {
            throw new AuraHandledException('Error fetching account details');
        }
        return accountWrappers;
    }
    public class AccountWrapper {
        @AuraEnabled public String accName ;
        @AuraEnabled public String accType ;
        @AuraEnabled public Integer contactCount ;
        @AuraEnabled public Integer caseCount ;
        @AuraEnabled public Integer opportunityCount ;
    }

}