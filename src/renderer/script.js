// Gestion de l'historique
function saveToHistory(searchTerm, results) {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const timestamp = new Date().toLocaleString('fr-FR');
    
    history.unshift({
        term: searchTerm,
        timestamp: timestamp,
        resultsCount: results.length
    });

    if (history.length > 50) {
        history.pop();
    }
    
    localStorage.setItem('searchHistory', JSON.stringify(history));
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const historyList = document.querySelector('.js-history-list');
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="no-history">Aucun historique pour le moment</p>';
        return;
    }
    
    historyList.innerHTML = history.map(entry => `
        <div class="history-item">
            <div class="history-term">
                <strong>🔍 ${entry.term}</strong>
                <span class="history-count">${entry.resultsCount} résultat(s)</span>
            </div>
            <div class="history-date">📅 ${entry.timestamp}</div>
        </div>
    `).join('');
}

function clearHistory() {
    if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
        localStorage.removeItem('searchHistory');
        loadHistory();
    }
}

function switchTab(tabName) {
   
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    

    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
    

    if (tabName === 'history') {
        loadHistory();
    }
}

function handleSubmit(event) {
    event.preventDefault();
    const inputField = document.querySelector('.js-search-input').value.trim();
    const inputResult = document.querySelector('.js-search-results');
    inputResult.innerHTML = '';

    const apiUrl = `https://fr.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8&format=json&origin=*&srlimit=20&srsearch=${inputField}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok' + response.statusText);
            return response.json();
        })
        .then(({ query: { search: results } }) => {
            if (results.length === 0) {
                alert('Aucun résultat trouvé')
                return;
            }

            saveToHistory(inputField, results);

            results.forEach(result => {
                const url = `https://fr.wikipedia.org/?curid=${result.pageid}`;
                inputResult.insertAdjacentHTML(
                    'beforeend',
                    `<div class ="result-item">
                    <h3 class = "result-title">
                        <a href="${url}" target = "_blank" rel = "noopener">${result.title}</a>
                    </h3>
                    <a href="${url}" class="result-link" target = "_blank" rel = "noopener">${url}</a> <br>
                    <span class="result-snippet">${result.snippet}</span> <br>
                    </div>`)
            })
        })
    .catch(error => {
        console.error('Une erreur est survenue : ', error);
        alert("Echec de la recherche. Veuillez réessayer plus tard.");
    });
}

// Event listeners
document.querySelector('.js-search-form').addEventListener('submit', handleSubmit);

document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => switchTab(button.dataset.tab));
});

document.querySelector('.clear-history-btn').addEventListener('click', clearHistory);