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

document.querySelector('.js-search-form').addEventListener('submit', handleSubmit);