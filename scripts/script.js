const insertButton = document.getElementById('insertButton');
const queryInput = document.getElementById('queryInput');
const executeQueryButton = document.getElementById('executeQueryButton');
const responseOutput = document.getElementById('responseOutput');

insertButton.addEventListener('click', () => {
    fetch('/insert', { method: 'POST' })
        .then(response => response.text())
        .then(data => {
            responseOutput.textContent = data;
        })
        .catch(error => {
            responseOutput.textContent = 'Error: ' + error;
        });
});

executeQueryButton.addEventListener('click', () => {
    const query = queryInput.value;
    fetch('/sql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
        .then(response => response.json())
        .then(data => {
            responseOutput.textContent = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            responseOutput.textContent = 'Error: ' + error;
        });
});