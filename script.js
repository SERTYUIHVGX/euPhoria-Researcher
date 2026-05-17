// Game categories to display in the popup
const GAME_CATEGORIES = [
    '2048', 'Flappy Bird', 'Chrome Dino', 'Mario', 'Minecraft Classic',
    'Tetris', 'Snake', 'Pac-Man', 'Breakout', 'Pong',
    'Doodle Jump', 'Jump King', 'Slope', 'Geometry Dash', 'Temple Run',
    'Cookie Clicker', 'Idle Breakout', 'Clicker Heroes', 'Candy Crush', 'Match 3',
    'Chess', 'Checkers', 'Tic Tac Toe', 'Wordle', 'Sudoku',
    'Racing Game', 'Street Racing', 'Drift Boss', 'Car Stunt', 'Moto X3M'
];

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const randomBtn = document.getElementById('randomBtn');
const articleContainer = document.getElementById('articleContainer');
const gamesModal = document.getElementById('gamesModal');
const closeModal = document.getElementById('closeModal');
const gamesList = document.getElementById('gamesList');

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
randomBtn.addEventListener('click', getRandomArticle);
closeModal.addEventListener('click', closeGamesModal);
window.addEventListener('click', function(event) {
    if (event.target === gamesModal) {
        closeGamesModal();
    }
});

// Handle Enter key
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    
    if (!query) {
        articleContainer.innerHTML = '<div class="error">Please enter a search term.</div>';
        return;
    }

    // Check if user typed "games"
    if (query === 'games') {
        openGamesModal();
        searchInput.value = '';
        return;
    }

    // Otherwise search Wikipedia
    searchWikipedia(query);
}

function getRandomArticle() {
    articleContainer.innerHTML = '<div class="loading">Loading random article...</div>';
    
    fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary')
        .then(response => response.json())
        .then(data => displayArticle(data))
        .catch(error => {
            console.error('Error:', error);
            articleContainer.innerHTML = '<div class="error">Failed to load article. Please try again.</div>';
        });
}

function searchWikipedia(query) {
    articleContainer.innerHTML = '<div class="loading">Searching Wikipedia...</div>';
    
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)
        .then(response => {
            if (!response.ok) throw new Error('Article not found');
            return response.json();
        })
        .then(data => displayArticle(data))
        .catch(error => {
            console.error('Error:', error);
            articleContainer.innerHTML = `<div class="error">Article not found. Try searching for something else or click "Random Article"!</div>`;
        });
}

function displayArticle(data) {
    const title = data.title || 'Unknown';
    const extract = data.extract || 'No description available.';
    const imageUrl = data.thumbnail ? data.thumbnail.source : null;
    const wikiUrl = data.content_urls.mobile.page || data.content_urls.desktop.page;

    let html = `
        <h2>${title}</h2>
        ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="max-width: 300px; border-radius: 8px; margin: 20px 0;">` : ''}
        <p>${extract}</p>
        <a href="${wikiUrl}" target="_blank" style="color: #667eea; text-decoration: none; font-weight: bold;">Read full article on Wikipedia →</a>
    `;

    articleContainer.innerHTML = html;
}

function openGamesModal() {
    gamesModal.classList.remove('hidden');
    populateGamesList();
}

function closeGamesModal() {
    gamesModal.classList.add('hidden');
}

function populateGamesList() {
    gamesList.innerHTML = GAME_CATEGORIES.map(game => `
        <div class="game-card" onclick="alert('Game: ${game}\\n\\nThis would link to the game asset if fully integrated with 3kh0 assets!')">
            <h3>🎮 ${game}</h3>
        </div>
    `).join('');
}

// Load random article on page load
window.addEventListener('load', getRandomArticle);