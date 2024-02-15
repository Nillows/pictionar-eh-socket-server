function selectDrawer(io, socket, room, roomData) {
    // Use the users array to select a random user
    console.log('number of users', roomData[room])
    const selectedUserIndex = Math.floor(Math.random() * roomData[room].users.length);
    // Grab that users id
    const selectedUserId = roomData[room].users[selectedUserIndex];

    if (roomData[room].lastDrawer) {
        if (roomData[room].lastDrawer === selectedUserId) {
            selectDrawer(io, socket, room, roomData);
        } else {
            roomData[room].lastDrawer = selectedUserId;
            let drawer = true;

            // Send true value to selected user
            io.to(selectedUserId).emit('userSelect', drawer);

            // Send false value to other users
            roomData[room].users.forEach(userId => {
                if (userId !== selectedUserId) {
                    drawer = false
                    io.to(userId).emit('userSelect', drawer);
                }
            });
        }
    } else {
        roomData[room].lastDrawer = selectedUserId;
        let drawer = true;

        // Send true value to selected user
        io.to(selectedUserId).emit('userSelect', drawer);

        // Send false value to other users
        roomData[room].users.forEach(userId => {
            if (userId !== selectedUserId) {
                drawer = false
                io.to(userId).emit('userSelect', drawer);
            }
        });
    }


};

module.exports = { selectDrawer }