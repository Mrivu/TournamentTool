const express = require('express');
const router = express.Router();

const gamemode = "None";
const gamemodes = ["None", "Average game"];

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
    res.json(gamemode);
});

module.exports = router;