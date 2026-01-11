import { LightningElement, api, track } from 'lwc';
import updateContact from '@salesforce/apex/contctDetails.updateContact';
import getContactById from '@salesforce/apex/contctDetails.getContactById';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class UpdateContactReord extends LightningElement {
    @api recordId; // Record ID passed from the parent component
    @track isModalOpen = false; // Controls modal visibility
    @track contactName = ''; // Contact name
    @track contactEmail = ''; // Contact email

    set recordId(value) {
        this._recordId = value;
        console.log('Setter called with value:', value);
        if (value) {
            this.isModalOpen = true; // Open the modal when recordId is set
            console.log('Record ID set:', value);
            getContactById({ contactId: value })
                .then((result) => {
                    this.contactName = result.FirstName;
                    this.contactEmail = result.Email;
                    console.log('Contact fetched:', result);
                })
                .catch((error) => {
                    console.error('Error fetching contact:', error);
                });
        }
    }
    get recordId() {
        return this._recordId;
    }

    // Close the modal
    closeModal() {
        this.isModalOpen = false;
    }

    // Handle input changes
    handleInputChange(event) {
        const field = event.target.label;
        if (field === 'Contact Name') {
            this.contactName = event.target.value;
        } else if (field === 'Contact Email') {
            this.contactEmail = event.target.value;
        }
    }

    // Save the contact
    saveContact() {
        console.log('Saving contact:', this.contactName, this.contactEmail);
        updateContact({ contactId: this.recordId, name: this.contactName, email: this.contactEmail })
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Contact updated successfully',
                        variant: 'success'
                    })
                );
                this.closeModal();
                    const refreshEvent = new CustomEvent('refreshdata', {
                        detail: { recordId: this.recordId }
                    });
                this.dispatchEvent(refreshEvent);

            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error updating contact',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}