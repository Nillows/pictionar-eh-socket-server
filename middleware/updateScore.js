// ./middleware/updateScore.js
function updateScore(gameState, playerId, points) {
    const player = gameState.players.find(p => p.id === playerId);
    if (player) {
      player.score += points;
      // Optionally, broadcast the updated scores to all players
    }
  }
  
  module.exports = updateScore;
  