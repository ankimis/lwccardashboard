import { LightningElement, wire } from 'lwc';
import getCars from '@salesforce/apex/Car.CarList';
import { publish,subscribe,MessageContext } from 'lightning/messageService';
import channelName from '@salesforce/messageChannel/CarsFiltered__c';
import selectedChannel from '@salesforce/messageChannel/CarSelected__c';

export default class CarTileList extends LightningElement {
    // filters = {
    //     search_Key:'',            
    //     price:9999999
    // };
    // filters = {};
    filters = {
    search_Key: '',
    catagoryPicklistValues: [],
    modelPicklistValues: [],
    price: 99999999
};
    cars;
    carFilterSubscription;
    //wire method to get cars based on filters
    @wire(getCars,{filters:'$filters'})
    wiredCars({ error, data }) {
        if (data) {
            this.cars = data;
            console.log('Cars loaded:', data);
        } else if (error) {
            console.error('Error loading cars:', error);
        }
    }
    //subscribe to message channel
    @wire(MessageContext)
    messageContext;


    
    connectedCallback() {
        this.subscribeToMessageChannel();
    }
    subscribeToMessageChannel() {
     this.carFilterSubscription =   subscribe(this.messageContext, channelName, (message) => {
            this.handleFilterChanges(message);
        });
    }
    handleFilterChanges(message) {

        this.filters ={ ...message.filters }
        console.log('Filters updated:', message.filters);
    }

    handleCarSelected(event) {
        const selectedCarId = event.detail;
        const message = {
            carId: selectedCarId
        };
        publish(this.messageContext, selectedChannel, message);
        console.log('Selected Car ID:', selectedCarId);
    }
    
}