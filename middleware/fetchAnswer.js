const fetch = require('node-fetch');

async function fetchRandomWord() {
    try {
        const apiUrl = 'https://pictionar-eh-api-7e9c6522d932.herokuapp.com/api/answers/random';
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Error fetching random word: ${response.statusText}`);
        }
        const data = await response.json();
        return data.word; // Assuming the API returns an object with the word in a property named "word"
    } catch (error) {
        console.error('Failed to fetch random word:', error);
        return null; // Handle the error appropriately in your application
    }
}

// Example usage
fetchRandomWord().then(word => {
    console.log('Random word:', word);
}).catch(error => {
    console.error(error);
});
