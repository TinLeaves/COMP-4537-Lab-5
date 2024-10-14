// Created in part with GitHub Copilot

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
            fetch('/insert', { method: 'POST' })
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
            fetch('/sql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
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