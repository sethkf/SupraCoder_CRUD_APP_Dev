const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const router = require("./router")

const app = express();

const BACKEND_PORT = 8080;

const acquireTimestamp = () => {
    let x = new Date();
    return x.toLocaleString('en-US', {hour12: false}) + ": ";
}

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use('/', router);

// Final app.listen [Put all necessary code above, this should be the last line.]
app.listen(BACKEND_PORT, () => {
    console.log(`${acquireTimestamp()}Server is active and looking at localhost:${BACKEND_PORT}.`);
});