import { LightningElement, wire } from 'lwc';
import fetchAccountDetails from '@salesforce/apex/AccountDetails.fetchAccountDetails';
const columns=[
    {label:'Account Name',fieldName:'accName',type:'text'},
    {label:'Account Type',fieldName:'accType',type:'text'},
    {label:'Number of Contacts',fieldName:'contactCount',type:'number'},
    {label:'Number of Cases',fieldName:'caseCount',type:'number'},
    {label:'Number of Opportunities',fieldName:'opportunityCount',type:'number'}
];
export default class PaginationOpp extends LightningElement {
columns=columns;
totalRecords;
recordsPerPage=5;
totalPages;
currentPage=1;
paginatedRecords=[];

@wire(fetchAccountDetails)
wiredAccountDetails({error,data}){
    if(data){
        this.totalRecords=data;
        this.totalPages=Math.ceil(this.totalRecords.length/this.recordsPerPage);
        this.setPaginatedRecords();
    }
    else if(error){
        console.error('Error fetching account details:', error);
    }   
}
setPaginatedRecords(){
    const startIndex=(this.currentPage-1)*this.recordsPerPage;
    const endIndex=this.currentPage*this.recordsPerPage;
    this.paginatedRecords=this.totalRecords.slice(startIndex,endIndex); 
    console.log('paginatedRecords:', this.paginatedRecords);    
}   
handleNext(){
    if(this.currentPage<this.totalPages){
        this.currentPage++;
        this.setPaginatedRecords();
    }

    }
handlePrevious(){
    if(this.currentPage>1){
        this.currentPage--;
        this.setPaginatedRecords();
    }
}
 }


