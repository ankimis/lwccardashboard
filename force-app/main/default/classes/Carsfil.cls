public with sharing class Carsfil {
             @AuraEnabled
            public String search_Key { get; set; }
            @AuraEnabled
            public String[] catagoryPicklistValues { get; set; }
            @AuraEnabled
            public String[] modelPicklistValues { get; set; }
            @AuraEnabled
            public Decimal price { get; set; }
}