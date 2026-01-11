import { LightningElement,track,wire } from 'lwc';
import contctDetails from '@salesforce/apex/contctDetails.getAllContacts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import  deleteRecord  from '@salesforce/apex/contctDetails.deleteContactById';
//columns for datatable
const columns = [
    {
        label: 'Contact Id',
        fieldName: 'Id',
        type: 'text',
        sortable: true
    },
    { label: 'Contact Name', fieldName: 'FirstName' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
     {
        type: 'button',
        label: 'Edit',
        initialWidth: 100,
        fixedWidth: 100,
        cellAttributes: {
            class: { fieldName: 'slds-text-align_center' }
        },
        typeAttributes: {
            label: 'Edit',
            name: 'edit',
            variant: 'brand'
        }
    },
    {
        type: 'button',
        label: 'Delete',
         initialWidth: 100,
        fixedWidth: 100,
        cellAttributes: {
            class: { fieldName: 'slds-text-align_center' }
        },
        typeAttributes: {
            label: 'Delete',
            name: 'delete',
            variant: 'destructive'
        }
    }
];

export default class Fetchname extends LightningElement {
 contactNames='';
 @track records=[];
 wiredRecords;
 @track error;
 updateid='';
 columns=columns;

 fetchContactNames(e){
    //get lightning input value
    const inputElement = this.template.querySelector('lightning-input');
    this.contactNames = inputElement.value;
    console.log('Contact Names: ' + this.contactNames);
    
 }
   // Wire the Apex method to fetch contacts
    @wire(contctDetails, { name: '$contactNames' })
    wiredContacts(result) {
        this.wiredRecords = result; // Store the result for refreshApex
        if (result.data) {
            this.records = result.data;
            this.error = undefined;
        } else if (result.error) {
            this.error = result.error;
            this.records = undefined;
        }
    }

   handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log('Action: ' + actionName);
        if (actionName === 'edit') {
            this.editContact(row);
        } else if (actionName === 'delete') {
            this.deleteContact(row);
        }
    }
   editContact(row) {
    console.log('Editing contact: ' + JSON.stringify(row));
    this.updateid = ''; // Reset the recordId to trigger the child component's setter
    setTimeout(() => {
        this.updateid = row.Id; // Set the new recordId after a short delay
    }, 0);
}
    deleteContact(row) {
        // Implement delete functionality here
        console.log('Deleting contact: ' + JSON.stringify(row));
        deleteRecord({ contactId: row.Id })
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact deleted',
                    variant: 'success'
                })
            );
            return refreshApex(this.wiredRecords);

        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error deleting contact',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });

    }
  // Handle the refresh event from the child component
    handleRefresh() {
        console.log('Refreshing data...');
        return refreshApex(this.wiredRecords);
    }
}