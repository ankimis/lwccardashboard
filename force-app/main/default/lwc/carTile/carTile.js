import { api, LightningElement } from 'lwc';

export default class CarTile extends LightningElement {
    // Public property to hold car data
   @api car={};

    
    handleClick() {
        this.dispatchEvent(  new CustomEvent('selected', {
            detail: this.car.Id 
        }));
    }

}