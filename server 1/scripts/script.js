// Created in part with GitHub Copilot

const apiRoute = 'https://comp-4537-lab-5-production.up.railway.app';

const insertButton = document.getElementById('insertButton');
const queryInput = document.getElementById('queryInput');
const executeQueryButton = document.getElementById('executeQueryButton');
const responseOutput = document.getElementById('responseOutput');

class UserInterface {
    constructor() {
        this.insertButton = document.getElementById('insertButton');
        this.queryInput = document.getElementById('queryInput');
        this.executeQueryButton = document.getElementById('executeQueryButton');
        this.responseOutput = document.getElementById('responseOutput');
    }

    addListerners() {
        this.insertButton.addEventListener('click', () => {
            fetch(`${apiRoute}/insertTestRows`, { method: 'POST' })
                .then(response => response.text())
                .then(data => {
                    this.responseOutput.textContent = data;
                })
                .catch(error => {
                    this.responseOutput.textContent = 'Error: ' + error;
                });
        });

        this.executeQueryButton.addEventListener('click', () => {
            const query = this.queryInput.value;

            let method = 'POST';
            if (/^(SELECT)/i.test(query)) {
                method = 'GET';
            }

            fetch(`${apiRoute}/sql`, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query : query })
            })
                .then(response => response.json())
                .then(data => {
                    this.responseOutput.textContent = JSON.stringify(data, null, 2);
                })
                .catch(error => {
                    this.responseOutput.textContent = 'Error: ' + error;
                });
        });
    }
}

new UserInterface().addListerners();