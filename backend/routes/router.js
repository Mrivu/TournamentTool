const express = require('express');

let gamemode = "None";
const gamemodes = ["None", "Average game"];

// Game attributes
// AVERAGE GAME
const averageGameResults = {};
router.get('/login', (req, res) => {
    const name = req.query.name;
    const number = req.query.number;
    averageGameResults[name] = number;
});


const router = express.Router();

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