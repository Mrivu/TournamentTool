const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes/router');

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

// Routers nii ei shit ass coodii: https://github.com/Paivola-Student-Innovation-Lab/DailyCrypt/blob/main/client/src/index.tsx
//https://reactrouter.com/en/main/start/tutorial