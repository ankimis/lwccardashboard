import { api, LightningElement } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartjs';
import { loadScript } from 'lightning/platformResourceLoader';

export default class Charts extends LightningElement {
    chart;
    chartInitialized = false;
    @api
    piechartKeys = [];
    @api
    piechartValues = [];
    @api chartHeading;
    @api type;

    initializeChart () {
        window.Chart.platform.disableCSSInjection = true;

        const canvas = document.createElement('canvas');
        canvas.className = 'chart';

        this.template.querySelector('.chart').appendChild(canvas);

        const ctx = canvas.getContext('2d');

        this.chart = new window.Chart(ctx, {
            type: this.type || 'bar',
            data: {
                labels: this.piechartKeys ? this.piechartKeys : [],
                datasets: [{
                    label: this.chartHeading ? this.chartHeading : 'Sample Data',
                    backgroundColor: [
                        'rgba(236, 13, 62, 0.8)',
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(255, 206, 86, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(153, 102, 255, 0.8)',
                        'rgba(255, 159, 64, 0.8)'
                    ],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    data: this.piechartValues ? this.piechartValues : []
                }]
            },
            options: {
                responsive: true, 
                    legend: {
                        position: this.type === 'doughnut' ? 'right' : 'top'
                    }  ,
                animation: {
                    animateRotate: true,
                    animateScale: true
                }
            }

        });
    }

    renderedCallback () {
        if (this.chartInitialized) {
            return;
        }

        this.chartInitialized = true;

        loadScript(this, chartjs + '/chartJs/Chart.js')
            .then(() => {
                console.log('Chart.js loaded successfully');
                this.initializeChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js', error);
            });
    }
}

