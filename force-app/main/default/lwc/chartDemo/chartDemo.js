import { LightningElement, wire } from 'lwc';
import getOpportunities from '@salesforce/apex/OppourtunityController.getOpportunities';


export default class ChartDemo extends LightningElement {
    piechartkeys=[];
    piechartdata=[];  
    @wire(getOpportunities)
    opportunities({ data, error }) {
        if (data) {
            console.log('Opportunities fetched successfully:', data);
            // Process the data as needed for the chart
            const result=data.reduce((acc, opp) => {
                const stage = opp.StageName;
                if (!acc[stage]) {
                    acc[stage] = 0;
                }
                acc[stage] += 1;
                return acc;
            }, {});
            if(Object.keys(result).length===0){
                console.log('No Opportunities found.');
            }
            if(Object.keys(result).length>0){
                this.piechartkeys=Object.keys(result);
                this.piechartdata=Object.values(result);
            }
            console.log('Processed Opportunity Data by Stage:', this.piechartkeys, this.piechartdata);
        } else if (error) {
            console.error('Error fetching opportunities:', error);
        }
        
    } 
}


  