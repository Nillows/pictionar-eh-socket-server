const { Server } = require('socket.io');
const { handleDraw, handleConnection, handleJoinRoom, handleMessage, handleLeave, handleDisconnect, handleRoomRequest, handleTimer } = require('./socket-handlers/socket')

const initializeSocketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "https://pictionar-eh.netlify.app",
            methods: ["GET", "POST"]
        }
    });
    const roomData = {
        room1: {
            users: [],
            count: 1,
            currentWord: 'tacos'
        },
        room2: {
            users: [],
            count: 2
        },
        boomboominmyroom: {
            users: [],
            count: 1
        }
    };
    const socketRoomMap = {};

    io.on('connection', (socket) => {
        handleConnection(io, socket, roomData)

        socket.on('join', (room) => {
            handleJoinRoom(io, socket, room, roomData)
            socketRoomMap[socket.id] = room;
            console.log(`socketmap: ${socketRoomMap}`)
        })

        socket.on('message', (room, message, username) => {
            handleMessage(io, socket, room, message, roomData, username)
        })

        socket.on('draw', (room, change) => {
            handleDraw(io, socket, room, change)
        })

        socket.on('leave', (room) => {
            handleLeave(io, socket, room, roomData)
        })

        socket.on('disconnect', (room) => {
            handleDisconnect(io, socket, roomData, socketRoomMap)
        })

        socket.on('requestRooms', () => {
            handleRoomRequest(io, socket, roomData)
        })

        socket.on('startTime', (room, timeLeft) => {
            handleTimer(io, socket, room, roomData, timeLeft)
        })
    })

    return io;
}

module.exports = initializeSocketServer;
