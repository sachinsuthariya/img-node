const {
    socketEvents
} = require("./constant");

const socket = {};
// listion on every connection
socket.connectSocekt = (io) => {
    io.on(socketEvents.connection, (socket) => {
        console.log("New user connected");
    });
};

module.exports = socket;