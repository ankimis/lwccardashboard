import { LightningElement } from 'lwc';

export default class AppContainer extends LightningElement {
    currentPage = 'openCases'; // Default page

    // Event handler for navigation
    handlePageChange(event) {
        this.currentPage = event.detail.page; // Set the active page based on the event
        // this.handleChartReady(event);
        console.log('OUTPUT : ',this.currentPage);
    }

    // Conditional rendering to load different components based on currentPage
    get isOpenCases() {
        return this.currentPage === 'openCases';
    }

    get isPortfolio() {
        return this.currentPage === 'portfolio';
    }

    get isAnalytics() {
        return this.currentPage === 'analytics';
    }

    get isSLA() {
        return this.currentPage === 'sla';
    }
    handleChartReady(event) {
        const { piechartkeys, piechartvalues } = event.detail;
        // this.template.querySelector('c-analysis-cases').piechartkeys = piechartkeys;
        // this.template.querySelector('c-analysis-cases').piechartvalues = piechartvalues;
    }
    refreshonbutton(event){
        console.log('Refresh event received in AppContainer');
        this.refs.refresddatachart.refreshData();
    }
}
