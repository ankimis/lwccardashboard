import { LightningElement,wire } from 'lwc'; 
import Name_field from '@salesforce/schema/Car__c.Name';
import MAKE from '@salesforce/schema/Car__c.Make__c';
import CATAGORY from '@salesforce/schema/Car__c.Category__c';
import Price_field from '@salesforce/schema/Car__c.MSRP__c';
import FuelType_field from '@salesforce/schema/Car__c.Fuel_Type__c';
import SEATS from '@salesforce/schema/Car__c.seats__c';
import ImageURL_field from '@salesforce/schema/Car__c.Picture_URL__c';
import { getFieldValue } from 'lightning/uiRecordApi';
import { subscribe,MessageContext} from 'lightning/messageService';
import selectedChannel from '@salesforce/messageChannel/CarSelected__c';

export default class CarCard extends LightningElement {

    @wire(MessageContext)
    messageContext;

    


    //exposing field references to use in the template
    nameField = Name_field;
    brandField = MAKE;
    modelField = CATAGORY;
    priceField = Price_field;
    fuelTypeField = FuelType_field;
    transmissionField = SEATS;
    imageURLField = ImageURL_field; 

    recordId;
    carname;
    image;
    handleLoad(e) {
        const {records} = e.detail;
        const recordData = records[this.recordId];
        this.carname = getFieldValue(recordData, Name_field);
        this.image = getFieldValue(recordData, ImageURL_field);

        console.log('Car record loaded successfully.');
    }
    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
     this.carSelectionSubscription =   subscribe(this.messageContext, selectedChannel, (message) => {
            this.handleCarSelection(message);
        });
    }

    handleCarSelection(message) {
        this.recordId = message.carId;
        console.log('CarCard received selected Car ID:', this.recordId);
    }
    disconnectedCallback() {
        // Unsubscribe from message channel
        if (this.carSelectionSubscription) {
            this.carSelectionSubscription = null;
        }
    }
    handleNavigateRecotrPage() {
        // Navigate to the record page
        const recordPageUrl = `/lightning/r/Car__c/${this.recordId}/view`;
        window.open(recordPageUrl, '_blank');
    }
}