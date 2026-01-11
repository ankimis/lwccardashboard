import { LightningElement,api } from 'lwc';

export default class BmiCalculator extends LightningElement {

   height='';
   weight='';
   bmivalue ='';
   result ='';

   inputhandler(e){
      const {name,value}= e.target;
      if(name === "height"){
            this.height =value;
      }
      if(name === "weight"){
         this.weight =value;         
      }
   }
   // //////
   submithandler(e){
         e.preventDefault();
         console.log(this.height+'height+thi'+this.weight);
         this.calculate();
   }
   ///calculat
   calculate(){
      let height =Number(this.height)/100;
      let bmi =Number(this.weight)/(height*height);
      this.bmivalue = Number(bmi.toFixed(2));
      if(this.bmivalue <18.5){
         this.result ="Underweight"
      }
      else if(this.bmivalue >=18.5 && this.bmivalue < 25 ){
         this.result ="Healthy"
      }
      else if(this.bmivalue >=25 && this.bmivalue < 30 ){
         this.result ="OverWeight"
      }
      else {
         this.result ="Obese"
      }
      console.log(this.bmivalue+'bmi');
      console.log(this.result+'bmi');
   }
   recalculate(){
      // calculate 
      this.height='';
      this.weight='';
      this.bmivalue ='';
      this.result ='';
   }
 
}