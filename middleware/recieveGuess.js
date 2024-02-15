// ./middleware/receiveGuess.js
function receiveGuess(io, gameState, playerId, guess) {
    if (guess.toLowerCase() === gameState.currentWord.toLowerCase() && gameState.isRoundActive) {
      updateScore(gameState, playerId, 1); // Update the score for the correct guess
      io.emit('correct guess', { playerId: playerId });
      endRound(io, gameState); // Optionally end the round early if the word is guessed
    } else {
      io.emit('guess result', { playerId: playerId, result: false });
    }
  }
  
  module.exports = receiveGuess;
  