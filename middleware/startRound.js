// ./middleware/startRound.js
const getRandomWord = require('./fetchAnswer'); // Assuming this exists

function startRound(io, room, roomData) {
  const gameState = roomData[room].gameState;
  const { players, currentDrawerIndex } = gameState;
  if (!players.length) return; // Ensure there are players in the room
  
  gameState.isRoundActive = true;
  gameState.currentWord = getRandomWord(); // Get a random word for the room
  const currentDrawer = players[currentDrawerIndex];
  
  io.to(room).emit('round started', { drawer: currentDrawer.name, word: gameState.currentWord });
  
  // Handle starting the timer and round logic here
  
  // Move to the next drawer for the next round
  gameState.currentDrawerIndex = (currentDrawerIndex + 1) % players.length;
}

module.exports = startRound;
