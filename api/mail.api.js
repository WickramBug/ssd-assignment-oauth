"use strict";

require("dotenv").config();
var fs = require("fs"),
    btoa = require("btoa"),
    express = require("express"),
    request = require("request"),
    router = express.Router();

const CLIENTID = process.env.CLIENTID,
    CLIENTSECRET = process.env.CLIENTSECRET,
    REDIRECTURI = process.env.REDIRECTURI;

var access_token = "";

router.get(
    "/oauth",
    (req, res) => {
        res.json({ url: generateOAuthUrl() });
    },
    (err) => {
        console.error(err);
        res.sendStatus(500);
    }
);

router.use("/oauth/oauthcallback", (req, res) => {
    var session = req.session;
    var code = req.query.code;

    var url = "https://www.googleapis.com/oauth2/v4/token";
    request(
        {
            uri: url,
            method: "POST",
            form: {
                code: code,
                client_id: CLIENTID,
                client_secret: CLIENTSECRET,
                grant_type: "authorization_code",
                redirect_uri: REDIRECTURI
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        },
        (err, response, body) => {
            if (err) {
                return console.error(err);
            }

            var json = JSON.parse(body);
            access_token = json.access_token;
            session["tokens"] = body;

            res.redirect("/home");
        }
    );
});

router.post("/send", (req, res) => {
    var mail = req.body;

    var message =
        "To: " +
        mail.to +
        "\r\nSubject: " +
        mail.subject +
        "\r\n\r\n" +
        mail.body;

    // upload request
    var url = "https://www.googleapis.com/gmail/v1/users/me/messages/send";
    request(
        {
            uri: url,
            method: "POST",
            headers: {
                "HTTP-Version": "HTTP/1.1",
                "Content-Type": "application/json",
                Authorization: "Bearer " + access_token
            },
            body: JSON.stringify({
                raw: btoa(message)
                    .replace(/\+/g, "-")
                    .replace(/\//g, "_")
            })
        },
        (error, response, body) => {
            if (error) {
                console.error(error);
                res.sendStatus(500);
            }

            console.log(body);
            // fs.unlink(file.path);
            res.sendStatus(200);
        }
    );
});

function generateOAuthUrl() {
    var authUrl = "https://accounts.google.com/o/oauth2/v2/auth?";

    var access_type = "access_type=offline&";
    var scope =
        "scope=" +
        encodeURIComponent(
            "https://www.googleapis.com/auth/gmail.send" +
                " " +
                "https://www.googleapis.com/auth/plus.me"
        ) +
        "&";
    var response_type = "response_type=code&";
    var client_id = "client_id=" + CLIENTID + "&";
    var redirect_uri = "redirect_uri=" + encodeURIComponent(REDIRECTURI);

    var oauthUrl =
        authUrl +
        access_type +
        scope +
        response_type +
        client_id +
        redirect_uri;
    return oauthUrl;
}

module.exports = router;
