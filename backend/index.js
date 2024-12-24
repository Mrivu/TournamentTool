const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const { Socket } = require('socket.io');

const io = require('socket.io')(3000, {cors: {origin: ['http://ivugames.fi', '0.0.0.0:80']}});

io.on("connection", socket => {
    console.log(socket.id);
    socket.on("test", message => {
        console.log(message);
    });
    socket.on("newRound", e => {
        socket.broadcast.emit("StartNewRound");
    });
    socket.on('endConnection', function (){
        socket.disconnect(0);
    });
    socket.on('removePlayer', (id) => {
        socket.to(id).emit("remove");
    });
    socket.on('AverageGameRoundWinner', (id) => {
        console.log("index hear")
        socket.to(id).emit("roundWinner");
    });
    socket.on('AverageGamePenalty', (id) => {
        console.log("index hear penalty")
        socket.to(id).emit("penalty");
    });
})

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use('/', router);

const port = 4000
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// Websocets
// Persistent connection between client and server