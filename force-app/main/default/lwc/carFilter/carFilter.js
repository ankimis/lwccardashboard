import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import { LightningElement, track, wire } from 'lwc';
import CAR_OBJECT from '@salesforce/schema/Car__c';
import Catagory_Field from '@salesforce/schema/Car__c.Category__c';
import Make_Field from '@salesforce/schema/Car__c.Make__c';

//import message channel error messages
import { publish, MessageContext } from 'lightning/messageService';
import channelName from '@salesforce/messageChannel/CarsFiltered__c';
/* https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_salesforce_modules */

const catagoryerror = 'Error loading car catagory options';
const makeerror = 'Error loading car make options';

export default class CarFilter extends LightningElement {
    //load message channel
    @wire(MessageContext)
    messageContext;
    
    
    //catagory field error message
    catagoryerror = catagoryerror;
    //make field error message
    makeerror = makeerror;
    timer;


    // Wire picklist values for Brand field
    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: Catagory_Field
    })
    catagoryPicklistValues;

    // Wire picklist values for Model field
    @wire(getPicklistValues, {
        recordTypeId: '$carObjectInfo.data.defaultRecordTypeId',
        fieldApiName: Make_Field
    })
    modelPicklistValues;

      filters = {
            search_Key:'',            
            price:9999999
        };

    // Object API name
    objectApiName = 'Car__c';
     @wire(getObjectInfo, { objectApiName: CAR_OBJECT})
    carObjectInfo;

    

    // Selected filter values
    @track selectedBrand = '';
    @track selectedModel = '';
    @track selectedPrice = 5000000;
    @track selectedFuelType = '';
    @track selectedTransmission = '';

    // Handle filter changes
    handleSearchBrand(event) {
        const { name, value } = event.target;
        this[name] = value;
        console.log('Selected Brand:', value);
        this.filters = { ...this.filters, search_Key: value };
        this.senddataToCarTileList();
        // Dynamically update the selected filter value
    }

        

    hanldlePriceChange(event) {
        this.selectedPrice = event.target.value;
        this.filters = { ...this.filters, price: this.selectedPrice };
        this.senddataToCarTileList();
    }
    handleCatagoryChange(event) {
         const value = event.target.value;
         const name = event.target.name;
         if(!this.filters.catagoryPicklistValues){
            const catagoryPicklistValues = this.catagoryPicklistValues.data.values.map(item=>item.value);
            this.filters={ ...this.filters, catagoryPicklistValues}
         }
         if(!this.filters.modelPicklistValues){
            const modelPicklistValues = this.modelPicklistValues.data.values.map(item=>item.value);
            this.filters={ ...this.filters, modelPicklistValues}
         }
        // console.log('value', value);
        // console.log('name', name);
    if(event.target.checked ) {
        // add to array
        if (!this.filters[name].includes(value)) {
            this.filters[name] = [...this.filters[name], value];
        }
    } else {
        // remove from array
        this.filters[name] = this.filters[name].filter(
            (item) => item !== value
        );
    }
        this.senddataToCarTileList();
        // console.log('Selected Catagory:', this.catagoryPicklistValues);

    }
    handleModelChange(event) {
        this.selectedModel = event.target.value;
    }
    senddataToCarTileList(){
        if (this.timer) {
            clearTimeout(this.timer);   
        }
        this.timer = setTimeout(() => {
           publish(this.messageContext, channelName, { filters: this.filters });
        }, 500);
        
    }
}