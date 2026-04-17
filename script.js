let searchHistory = JSON.parse(localStorage.getItem("History")) || [];

async function searchWord() {
    const word =document.querySelector('#word-input').value.trim();
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        renderResult(data[0]);
        saveToHistory(word);
        wordInput.value = '';
    }
    catch(error) {
        console.log('Error finding word');
    }
}

function renderResult(entry) {
    const displayWord = document.querySelector('#result-display');
    //Template literals
    displayWord.innerHTML =`
        <div class="result-card">
            <h2>${entry.word}</h2>
            <p class="speech-type">${entry.meanings[0].partOfSpeech}</p>
            <p class="definition">${entry.meanings[0].definitions[0].definition}</p>
            <button id="voice-btn">Listen</button>
        </div>
    `;

    document.querySelector('#voice-btn').addEventListener('click', () => {
        const speech = new SpeechSynthesisUtterance(entry.word);
        window.speechSynthesis.speak(speech);
    });
}

function saveToHistory(word) {
    if(!searchHistory.includes(word)) {
        searchHistory.unshift(word); //Adds to front/top of list
        localStorage.setItem('History', JSON.stringify(searchHistory));
        updateHistoryUI();
    }
}

function updateHistoryUI() {
    const historyList = document.querySelector('#history-list');
    if (!historyList) return;

    historyList.innerHTML = searchHistory.map(word => `<li>${word}</li>`).join('');
}

updateHistoryUI();

document.querySelector('#search-btn').addEventListener('click', searchWord);

document.querySelector('#word-input').addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        searchWord();
    }
});

document.querySelector('#clear-history').addEventListener('click', () => {
    localStorage.removeItem('History');
    searchHistory = [];
    updateHistoryUI();
});