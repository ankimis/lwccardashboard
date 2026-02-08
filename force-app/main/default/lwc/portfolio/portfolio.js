import { LightningElement,api } from 'lwc';

export default class Portfolio extends LightningElement {
    @api name = 'John Doe';
    @api title = 'Salesforce Developer';
    @api profileImage = 'https://via.placeholder.com/150';

    @api email = 'johndoe@example.com';
    @api linkedin = 'https://linkedin.com/in/johndoe';
    @api github = 'https://github.com/johndoe';

    @api skills = ['Apex', 'LWC', 'JavaScript', 'CSS', 'Salesforce Flows'];
     get mailtoLink() {
        return `mailto:${this.email}`;
    }
    @api projects = [
        {
            id: 1,
            title: 'Project One',
            description: 'Description of Project One.',
            image: 'https://via.placeholder.com/300x200',
            link: 'https://example.com/project1'
        },
        {
            id: 2,
            title: 'Project Two',
            description: 'Description of Project Two.',
            image: 'https://via.placeholder.com/300x200',
            link: 'https://example.com/project2'
        },
        {
            id: 3,
            title: 'Project Three',
            description: 'Description of Project Three.',
            image: 'https://via.placeholder.com/300x200',
            link: 'https://example.com/project3'
        }
    ];
}