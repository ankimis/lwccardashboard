import {  LightningElement,wire } from 'lwc';
import openCases from '@salesforce/apex/CasesOpened.getOpenCases';
import { NavigationMixin } from 'lightning/navigation';
import assignOwner from '@salesforce/apex/CasesOpened.assignOwner';
import closeCase from '@salesforce/apex/CasesOpened.closeCase';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import USER_ID from '@salesforce/user/Id'; 
import {  MessageContext, publish} from 'lightning/messageService';
import channelName from '@salesforce/messageChannel/chartDataChannel__c';
import { refresh } from '@salesforce/apex';
/* https://developer.salesforce.com/docs/component-library/documentation/en/lwc/lwc.reference_salesforce_modules */


export default class OpenCases extends NavigationMixin (LightningElement) {
    cases;
    error;
    refreshInterval;
    piechartkeys;
    piechartvalues;
    piecharkeys; 
    chartDatas={}
    analysisData=false
    casesrefrsfResult;
    @wire(MessageContext)
    messageContext;

    connectedCallback() { 
            this.loadCases(); 
    }
 
      loadCases() {        
        openCases()
            .then( result => {
                this.casesrefrsfResult = result;
                this.cases = result.map(c => {
                let rowClass = '';
                let priorityBadge = '';
                    switch(c.Priority) {
                    case 'Medium':
                        rowClass = 'slds-theme_alert-texture'; // red background
                        priorityBadge = 'slds-badge slds-badge_destructive';
                        break;
                    case 'High':
                        rowClass = '';
                        priorityBadge = 'slds-badge slds-badge_warning';
                        break;
                    case 'Low':
                        rowClass = '';
                        priorityBadge = 'slds-badge slds-badge_success';
                        break;
                    default:
                        rowClass = '';
                        priorityBadge = 'slds-badge';
                }
                    return {
                        ...c,
                        rowClass: rowClass,
                        priorityBadge: priorityBadge    
                    };
                });
                this.getChartAnalysisData();
                
                this.error = undefined;
                // console.log('OUTPUT : ',this.cases);
            })
            .catch(error => {
                this.error = error;
                this.cases = undefined;
                console.error('Error fetching open cases: ', error);
            });
    }
    navigateToCase(event) {
        const caseId = event.currentTarget.dataset.id;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: caseId,
                objectApiName: 'Case',
                actionName: 'edit'
            }
        });
    }
    handleAction(event) {
            const caseId = event.currentTarget.dataset.id;
            const action = event.currentTarget.dataset.action;

            if (action === 'assign') {
                // Example: assign to current user (can be dynamic)
                assignOwner({ caseId: caseId, ownerId: USER_ID })
                    .then(() => {
                        this.showToast('Success', 'Owner assigned', 'success');
                        this.loadCases(); // refresh table
                    })
                    .catch(error => {
                        this.showToast('Error', error.body.message, 'error');
                    });
            }
            if (action === 'close') {
                closeCase({ caseId: caseId })
                    .then(() => {
                        this.showToast('Success', 'Case closed', 'success');
                        this.loadCases(); // refresh table
                    })
                    .catch(error => {
                        this.showToast('Error', error.body.message, 'error');
                    });
            }
            this.refreshData();
            this.dispatchEvent(new CustomEvent('refreshonbutton',{
                bubbles: true,
                composed: true
            })); // Notify parent to refresh if needed
        }
    showToast(title, message, variant) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant
        });
        this.dispatchEvent(event);
    }   
 getChartAnalysisData() {
        if (!this.cases || !this.cases.length) {
            console.warn('No case data available.');
            return;
        }
        //publish message for how many open cases are there
        publish(this.messageContext, channelName, { openCasesCount: this.cases.length });
        // console.log('Published number of open cases:', this.cases.length);
        

        // Aggregate by priority    
        const chartData = this.cases.reduce((acc, caseRecord) => {
            const priority = caseRecord.Priority;
            acc[priority] = (acc[priority] || 0) + 1;
            return acc;
        }, {});

        // Convert to keys and values arrays
        this.piechartkeys = Object.keys(chartData);
        this.piechartvalues = Object.values(chartData);

        // Optional: force re-render if using chart component
        this.piecharkeys = Date.now(); 

        // Prepare payload for LMS
        this.chartDatas = {
            piechartkeys: this.piechartkeys,
            piechartvalues: this.piechartvalues
        };

        // console.log('Processed Chart Data:', this.piechartkeys, this.piechartvalues);

        // ✅ Publish to LMS
        publish(this.messageContext, channelName, this.chartDatas);

        console.log('Published chart data:', this.chartDatas);
    }    
    refreshData() {
        refresh(this.casesrefrsfResult);
    }
}