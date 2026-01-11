
import { LightningElement, api } from 'lwc';

export default class ContactRecords extends LightningElement {

    options = [
        { label: 'Full Name', value: 'fullname' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' }
    ];
    columns = [
        { label: 'Full Name', fieldName: 'fullname' },
        { label: 'Email', fieldName: 'email' },
        { label: 'Phone', fieldName: 'phone' }
    ];
    data = [];

    _record;

    @api
    set record (value) {
        this._record = value;
        console.log('record pp:', JSON.stringify(this._record));

        this.data = JSON.parse(JSON.stringify(this._record));
        console.log('this.data', this.data);
    }

    get record () {
        return this._record;
    }
    handleChange (event) {
        const field = event.target.value;
        console.log('field', field);
        const sortedData = JSON.parse(JSON.stringify(this.data));
        sortedData.sort((a, b) => {
            if (a[field] < b[field]) {
                return -1;
            }
            if (a[field] > b[field]) {
                return 1;
            }
            return 0;
        });
        console.log('sortedData', sortedData);
        this.data = sortedData;
    }
    deleteContact (event) {
        event.preventDefault();
        const index = event.currentTarget.dataset.id;
        console.log(index)
        this.dispatchEvent(new CustomEvent('deletecontact', { detail: index }));
    }
    updateContact (e) {
        e.preventDefault();
        const index =e.currentTarget.dataset.id;
        console.log('index', index);
        this.dispatchEvent(new CustomEvent('updatecontact', { detail: index }));
    }
}