function sendWord(io, socket, room, roomData) {
    io.to(room).emit('chosenWord', roomData[room].currentWord);
    console.log('word sent: ', roomData[room].currentWord);
}

module.exports = {sendWord};