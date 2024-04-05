const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();

// Use body-parser middleware to parse request bodies
router.use(bodyParser.json());

let gamemode = "None";
const gamemodes = ["None", "Average game", "Box game", "El farol"];


// Game attributes

let participants = {};
router.post('/participate', (req) => {
    const name = req.body.name;
    const socketID = req.body.socketID;
    participants[name] = socketID;
});

router.get('/getParticipants', (req, res) => {
    res.json(participants);
});

router.post('/clearParticipants', () => {
    participants = {};
});


// AVERAGE GAME
let averageGameResults = {};
router.post('/sendAverageGameNumber', (req) => {
    const name = req.body.name;
    const number = parseInt(req.body.number); // Convert number to integer
    averageGameResults[name] = number;
    console.log("Success!");
    console.log(averageGameResults);
    console.log(req.query);
});

router.get('/getAverageGameResults', (req, res) => {
    console.log("Got Scores!");
    let sum = 0;
    for (value in averageGameResults) {
        sum += averageGameResults[value];
    }
    sum = sum/Object.keys(averageGameResults).length;
    averageGameResults["Average"] = sum*0.8;
    res.json(averageGameResults);
    averageGameResults = {};
});

// BOX GAME
let boxGameResults = {};
router.post('/sendBoxGameTokens', (req) => {
    const name = req.body.name;
    const number = parseInt(req.body.number); // Convert number to integer
    boxGameResults[name] = number;
});

router.get('/getBoxGameResults', (req, res) => {
    console.log("Got Scores!");
    res.json(boxGameResults);
    boxGameResults = {};
});

// EL FAROL
let prizes = [5,10,15];
let ElFarolResults = {};
router.post('/sendElFarolChoice', (req) => {
    const name = req.body.name;
    const choice = req.body.choice;
    ElFarolResults[name] = choice;
});

router.get('/getElFarolResults', (req, res) => {
    console.log("Got Scores!");
    res.json(ElFarolResults);
    ElFarolResults = {};
});


router.get('/login', (req, res) => {
        const password = "myPass";
        const inputPassword = req.query.password;
        if (inputPassword == password) {
            res.json(true);
        } else {
            res.json(false);
        }
});

router.get('/changeGamemode', (req, res) => {
    const gamemodeChange = req.query.gamemode;
    if (gamemodes.includes(gamemodeChange)) {
        gamemode = gamemodeChange;
        res.json(true);
    }
    else {
        res.json(false);
    }
});

router.get('/getGamemode', (req, res) => {
    res.send({gamemode:gamemode});
});
router.get('/getPrize', (req, res) => {
    res.send({prize:prizes[req.query.round-1]});
});


module.exports = router;