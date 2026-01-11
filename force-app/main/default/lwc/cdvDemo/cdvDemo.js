import { LightningElement, wire } from 'lwc';
import generateCsv from '@salesforce/apex/CsvController.generateCsv';
import {csvGenerator} from 'c/utils';
import Id from '@salesforce/schema/Account.Id';


export default class CdvDemo extends LightningElement {
    accountHeader ={
        Id: 'Record ID',
        Name: 'Account Name',
        Phone: 'Phone Number',
        Industry: 'Industry',
        Type: 'Type'
    }
    accountData=[];
    @wire(generateCsv)
    wiredCsv({ error, data }) {
        if (data) {
            console.log('CSV Data fetched successfully:', data);
            this.accountData = data;
        } else if (error) {
            console.error('Error fetching CSV data:', error);
        }
    }
    generateCSV() {
        // This method can be used to trigger CSV generation if needed
        csvGenerator(this.accountData, this.accountHeader, 'Account_Data');
        console.log('Generating CSV data...');



    }
}