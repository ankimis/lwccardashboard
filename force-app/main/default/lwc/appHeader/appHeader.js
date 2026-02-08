import { LightningElement, api, wire } from 'lwc';
import { subscribe,unsubscribe,MessageContext} from 'lightning/messageService';
import channelName from '@salesforce/messageChannel/chartDataChannel__c';

export default class AppHeader extends LightningElement {

    // ===== Public data from parent =====
    @api openCasesCount = 0;
    @api slaBreachCount = 0;
    @api activePage = 'openCases';

    // ===== Private data =====
    subscription = null;
    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                channelName,
                (message) => {
                    this.handleMessage(message);
                }
            );
        }
    }

    handleMessage(message) {
        if (message.openCasesCount !== undefined) {
            this.openCasesCount = message.openCasesCount;
        }
        if (message.slaBreachCount !== undefined) {
            this.slaBreachCount = message.slaBreachCount;
        }
    }
    
    disconnectedCallback() {
        unsubscribe(this.subscription);
        this.subscription = null;
    }

    // ===== Navigation config =====
    navItems = [
        { name: 'openCases', label: 'Dashboard' },
        { name: 'portfolio', label: 'Portfolio' },
        { name: 'analytics', label: 'Analytics' },
        { name: 'sla', label: 'SLA' }
    ];

    // ===== Computed navigation with active state =====
    get navItemsWithState() {
        return this.navItems.map(item => {
            return {
                ...item,
                class:
                    item.name === this.activePage
                        ? 'slds-button slds-button_neutral slds-button_brand'
                        : 'slds-button slds-button_neutral slds-m-horizontal_xx-small'
            };
        });
    }

    // Fix template reference
    get navItems() {
        return this.navItemsWithState;
    }

    // ===== Navigation click =====
    handleNavigation(event) {
        const pageName = event.target.dataset.name;

        this.dispatchEvent(
            new CustomEvent('navigate', {
                detail: { page: pageName }
            })
        );
    }

    // ===== Refresh click =====
    handleRefresh() {
        this.dispatchEvent(new CustomEvent('refresh'));
    }
}
