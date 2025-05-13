const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["*"],
            credentials: true
        },
        transports: ['websocket', 'polling'],
        pingTimeout: 60000,
        pingInterval: 25000,
        connectTimeout: 45000,
        allowEIO3: true
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('join', async (data) => {
            try {
                const { userId, userType } = data;
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (error) {
                console.error('Error in join event:', error);
                socket.emit('error', { message: 'Error joining room' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            try {
                const { userId, location } = data;
                if (!location || !location.ltd || !location.lng) {
                    return socket.emit('error', { message: 'Invalid location data' });
                }
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            } catch (error) {
                console.error('Error in update-location-captain:', error);
                socket.emit('error', { message: 'Error updating location' });
            }
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client disconnected: ${socket.id}, reason: ${reason}`);
        });
    });

    io.engine.on('connection_error', (err) => {
        console.error('Connection error:', err);
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    console.log('Sending message:', messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.error('Socket.io not initialized.');
    }
}

module.exports = { initializeSocket, sendMessageToSocketId };