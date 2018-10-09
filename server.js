"use strict";

var path = require("path"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    express = require("express"),
    session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    session({
        secret: "notasecret",
        resave: true,
        saveUninitialized: true
    })
);

app.use(express.static(__dirname + "/public"));
app.set("/view", path.join(__dirname, "/public/view"));
app.use("/node", express.static(__dirname + "/node_modules"));

var mailAPI = require("./api/mail.api");

app.use("/api/gmail", mailAPI);

app.use("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(port, function(err) {
    if (err) {
        console.error(err);
        return;
    }

    console.log("Server running on port " + port);
});