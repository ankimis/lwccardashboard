import { LightningElement,track } from 'lwc';

export default class ContactApp extends LightningElement {
    
     @track recordId;
     @track fullName;
     @track email;  
     @track phone;
     messages = '';
     messageShow = false;
     contacts = [];
     modalStatus = false;
     modalStatus2 = false;
    handleChange (event) {
        this[event.target.name] = event.target.value;
    }
    labelbutton='Create Contact';

    createContact (e) {
        console.log('create contact');
        this.messages = 'PLEASE ENTER VALID ';
        console.log('Record : ID',this.recordId);

        // Create contact object dynamically        

        e.preventDefault();
        const contact = {
            fullName: this.fullName,
            email: this.email,
            phone: this.phone
        }; 
          //console.log('contact:', contact);
        if (this.validate(contact) !== true) {
            this.messageShow = true;
            return;
        }

        if(this.recordId) {
            console.log('Update Contact Logic');
            this.contacts = this.contacts.map(cont => {
                if (cont.email === this.recordId) {
                    return { ...cont, fullName: this.fullName, email: this.email, phone: this.phone };
                }
                return cont;
            });
            this.labelbutton='Create Contact';
            this.recordId = null;
        } else {
             console.log('Add Contact Logic');
             this.contacts = [...this.contacts, contact];
        }      

         const inputs = this.template.querySelectorAll('lightning-input');
         inputs.forEach(input => (input.value = ''));
         this.contact={};
        this.messageShow = false;
        this.fullName = '';
        this.email = '';
        this.phone = '';
        
    }
    validate (contact) {
        if (!contact.fullName || !contact.email || !contact.phone) {
            this.messages += 'All fields are required.';
            return false;
        }
        if (contact.fullName) {
            // regext for full name validation
            const nameRegex = /^[a-zA-Z\s]+$/;
            if (!nameRegex.test(contact.fullName)) {
                //   i just want message show belowinput fiile
                this.messages += 'Full Name.';
                return false;
            }
        }
        if (contact.email) {
            // regex for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contact.email)) {
                this.messages += 'Email address.';
                return false;
            }
        }
        if (contact.phone) {
            // regex for phone number validation
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(contact.phone)) {
                this.messages += ' phone number.';
                return false;
            }
        }
        this.messageShow = false;
        return true;

    }
    deletecontct(event) {
        const index = event.detail;
        console.log('index', index);
        this.contacts = this.contacts.filter(cont => cont.email !== index);
        this.contacts = [...this.contacts];     
    }
    updatecontact(event) {
        const index = event.detail; 
        console.log('inde dfdx', index);
        const contact = this.contacts.find(cont => cont.email === index); 
        const inputs = this.template.querySelectorAll('lightning-input');
         
            if(contact.email === index) {
                inputs.forEach(input => (
                    input.value = contact[input.name] ,
                    this[input.name] = contact[input.name]
                ));
            } 
        // document.querySelector('input[name="recordId"]').value = index;
        // document.getElementById('recordId').value = index;
        this.recordId = index;
        this.labelbutton='Update Contact';

        //  console.log('Document : ', document.querySelector('input[name="recordId"]').value);

    }
    openmodel() {
        this.modalStatus = true;
    }
    openmodel2() {
        this.modalStatus2 = true;
    }
    closeModal2() {
        this.modalStatus2 = false;
    }
    closeModal() {
        this.modalStatus = false;
    }

    // --------------lwc if else demo -----------------
    country = 'India';

    get isCountryIndia() {
        console.log('OUTPUT : ',this.country);
        return this.country === 'India';
    }
    get isCountryCanada() {
        console.log('OUTPUT : ',this.country);
        return this.country === 'Canada';
    }

    handleChange(event) {
        this.country = event.target.value;
    }
     

}

