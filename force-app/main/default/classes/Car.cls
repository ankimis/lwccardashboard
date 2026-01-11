    public with sharing class Car {

        public class Filters {
            @AuraEnabled
            public String search_Key { get; set; }
            @AuraEnabled
            public String[] catagoryPicklistValues { get; set; }
            @AuraEnabled
            public String[] modelPicklistValues { get; set; }
            @AuraEnabled
            public Decimal price { get; set; }
        }

        // Method to fetch the list of cars
        @AuraEnabled(cacheable=true)
        public static List<Car__c> CarList(Filters filters) {
            String key, whareClause = '';
            Decimal price;
            String[] catagoryPicklistValues, modelPicklistValues;
            List<String> criateria = new List<String>();

        try {
                System.debug('price: ' + price);
            if (filters != null) {
                key = filters.search_Key;
                catagoryPicklistValues = filters.catagoryPicklistValues;
                modelPicklistValues = filters.modelPicklistValues;
                price = filters.price;

                if (key != null && key != '') {
                    criateria.add('(Name LIKE \'%' + key + '%\')');
                }
                if (catagoryPicklistValues != null && catagoryPicklistValues.size() > 0) {
                    criateria.add('Category__c IN :catagoryPicklistValues');
                }
                if (modelPicklistValues != null && modelPicklistValues.size() > 0) {
                    criateria.add('Make__c IN :modelPicklistValues');
                }
                if (price != null && price > 0) {
                    criateria.add('MSRP__c <= :price');
                }
                if (criateria.size() > 0) {
                    whareClause = ' WHERE ' + String.join(criateria, ' AND ');
                }                        
            }
            String query = 'SELECT Id, Name, Category__c, Make__c, MSRP__c, Fuel_Type__c, seats__c, Picture_URL__c FROM Car__c ' + whareClause + ' ORDER BY Name DESC ';
                System.debug('Query: ' + query);
            return Database.query(query);
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching car records.'+ e.getMessage());
        }
        }
    }