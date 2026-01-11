import { LightningElement } from 'lwc';

export default class ModelResonsive extends LightningElement {
    closeModal () {
        this.dispatchEvent(new CustomEvent('closemodal'));
    }
    closeModal2 () {
        this.dispatchEvent(new CustomEvent('closemodal2'));
    }
}