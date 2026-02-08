import {   api, LightningElement,wire } from 'lwc';
// import {  MessageContext, subscribe ,unsubscribe} from 'lightning/messageService';
// import channelName from '@salesforce/messageChannel/chartDataChannel__c';
import getChart  from '@salesforce/apex/CasesOpened.getChartData';

export default class AnalysisCases extends LightningElement {

 
    piecharkeys=[];
    piechartvalues=[];  
    
    subscription = null;
    resultdatarefresh;

    // connectedCallback() {
    //     this.subscribeToMessageChannel();
    // }
    // @wire(MessageContext)
    // messageContext; 

    @wire(getChart)
    data(result) {
        this.resultdatarefresh=result;
        const { data, error } = result;        
        if (data) {
            console.log('Received data from Apex:1', data);
            this.piecharkeys = Object.keys(data);
            this.piechartvalues = Object.values(data); 
            console.log('Received data from Apex in analysisCases:', this.piecharkeys, this.piechartvalues);
        }
        if (error) {
            console.error('Error fetching chart data from Apex:', error);
        }
    }

   

    // subscribeToMessageChannel() {
    //     if (!this.subscription) {
    //         console.log('ss12');  
    //         this.subscription = subscribe(
    //             this.messageContext,
    //             channelName,
    //             (message) => {console.log('Message received:', message);
    //             this.handleMessage(message);}
    //             );
    //     }
    // }

    // handleMessage(message) { 
    //     this.piecharkeys = message.piechartkeys;
    //     this.piechartvalues = message.piechartvalues; 
    //     console.log('Received message in analysisCases:', this.piecharkeys, this.piechartvalues);
    // }

    // disconnectedCallback() {
    //     unsubscribe(this.subscription);
    //     this.subscription = null;
    // } 
    @api
    refreshData() {
        refresh(this.resultdatarefresh);
    }
     
}