const bodyParser = require('body-parser');
const express = require('express');

const router = express.Router();

// Use body-parser middleware to parse request bodies
router.use(bodyParser.json());

let gamemode = "None";
const gamemodes = ["None", "Average game"];


// Game attributes
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

module.exports = router;