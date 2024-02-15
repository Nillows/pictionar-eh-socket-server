const { selectDrawer } = require('../middleware/selectDrawer')
const { sendWord } = require('../middleware/sendWord');
var timeLeft = "60";
const handleTimer = (io, socket, room, roomData, timeLeft) => {
    console.log(timeLeft);
    // while (timeLeft > 0) {
    roomData[room].timeLeft = timeLeft

    function setTime() {
        // Sets interval in variable
        var timerInterval = setInterval(function () {
            roomData[room].timeLeft--;
            // timeEl.textContent = "Timer: " + timeLeft;

            if (roomData[room].timeLeft <= 0) {
                // Stops execution of action at set interval
                clearInterval(timerInterval);
                // Call function to start new game
                gameFunction(io, socket, room, roomData)
            }
            io.to(room).emit('startTime', roomData[room].timeLeft)
        },
            1000);
    }
    // console.log("loop : " + timeLeft);
    setTime();
    // }
    // io.to(room).emit('startTime', {
    //     timeLeft
    // });

}

// handleTimer();
const { getRandomWord } = require('../middleware/randomAnswer')
const { checkForWinningPhrase } = require('../middleware/answerEval')

const handleConnection = (io, socket) => {
    console.log(`User connected: ${socket.id}`)
}

const handleJoinRoom = (io, socket, room, roomData) => {
    socket.join(room);
    console.log(`${socket.id} joined room ${room}`);
    socket.emit(`Welcome to ${room}`);

    if (!roomData[room]) {
        roomData[room] = { count: 1, users: [] };
    } else {
        roomData[room].count += 1;
    }

    roomData[room].users.push(socket.id);
    console.log(roomData[room]);

    io.to(room).emit("updateRoomData", roomData[room]);

    roomData[room].gameRunning = false;

    // handleTimer(io, socket, room, roomData, timeLeft);
    if (roomData[room].users.length >= 2) {
        if (roomData[room].gameRunning === false) {
            gameFunction(io, socket, room, roomData);
            roomData[room].gameRunning = true
        }

    }

}



const handleMessage = (io, socket, room, message, roomData, username) => {
    console.log(`Received message from ${socket.id}: ${message} in room ${room}`)
    console.log('currentword', roomData[room])
    // Check if currentWord exists
    if (roomData[room].currentWord) {
        // Check if word matches and send corresponding boolean value
        const correctBool = checkForWinningPhrase(message, roomData[room].currentWord);
        console.log(correctBool);
        io.to(room).emit('broadcastMessage', message, username, correctBool, roomData[room].timeLeft);
    } else {
        io.to(room).emit('broadcastMessage', { correctBool: false }, username);
    }

}

const handleDraw = (io, socket, room, change, roomData) => {
    console.log(`Draw event from socket ${socket.id} in room: ${room}`)
    // console.log(change); //socket is able to read the change 
    io.to(room).emit('drawChange', change)
}

const handleLeave = (io, socket, room, roomData) => {
    socket.leave(room);
    // console.log(`Socket ${socket.id} left room ${room}`);
    if (roomData[room]) {
        // roomData[room].count -= 1;

        if (roomData[room].count <= 0) {
            // delete roomData[room];
        } else {
            io.to(room).emit('updateRoomData', roomData[room])
        }

        // Get the index of the user who left
        const userIndex = roomData[room].users.indexOf(socket.id);
        // Check that they are present in the array and remove
        if (userIndex !== -1) {
            roomData[room].users.splice(userIndex, 1);
            console.log(roomData[room])
        }
    }

    // console.log(roomData)
}

const handleDisconnect = (io, socket, roomData, socketRoomMap) => {
    const roomId = socketRoomMap[socket.id];

    if (roomId && roomData[roomId]) {
        roomData[roomId].count -= 1;

        if (roomData[roomId].count <= 0) {
            delete roomData[roomId]
        } else[
            io.to(roomId).emit('updateRoomData', roomData[roomId])
        ]
    }
    console.log(roomData)
}

const handleRoomRequest = (io, socket, roomData) => {
    io.to(socket.id).emit('activeRooms', roomData);
}

const gameFunction = (io, socket, room, roomData) => {
    if (roomData[room].users.length >= 2) {
        // 1.Choose word and store in room data as currentWord
        getRandomWord().then(word => {
            // Store word in the roomData
            roomData[room].currentWord = word;

            // Choose who draws
            selectDrawer(io, socket, room, roomData);

            // Send word to front
            sendWord(io, socket, room, roomData);

            // Start timer
            handleTimer(io, socket, room, roomData, timeLeft);

        }).catch(err => {
            console.error("Error fetching word:", err);
        });
    } else {
        console.log('Not enough players to start game')
    }

};


module.exports = {
    handleConnection,
    handleJoinRoom,
    handleMessage,
    handleDraw,
    handleLeave,
    handleDisconnect,
    handleRoomRequest,
    handleTimer,
    gameFunction
}
