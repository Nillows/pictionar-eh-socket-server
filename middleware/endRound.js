// ./middleware/endRound.js
function endRound(io, gameState) {
    clearTimeout(gameState.timer);
    gameState.isRoundActive = false;
    io.emit('round ended', { correctWord: gameState.currentWord });
    // Prepare for next round or game end
  }
  
  module.exports = endRound;
  