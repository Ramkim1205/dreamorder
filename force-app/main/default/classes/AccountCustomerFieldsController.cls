public with sharing class AccountCustomerFieldsController {
    @AuraEnabled(cacheable=true)
    public static Account getAccountDetails(Id recordId) {
        return [SELECT Amount__c, Priority__c, 
                       ServingRobotCount__c, TableOrderCount__c
                FROM Account
                WHERE Id = :recordId LIMIT 1];
    }

    @AuraEnabled(cacheable=true)
    public static String getFormattedAmount(Id recordId) {
        Account acc = [SELECT Amount__c FROM Account WHERE Id = :recordId LIMIT 1];

        if (acc.Amount__c != null) {
            String formattedAmount = '₩' + acc.Amount__c.setScale(0).format();
            return formattedAmount;
        } else {
            return '₩0';
        }
    }
}