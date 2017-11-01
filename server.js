// Require our dependencies
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const rp = require('request-promise');
const cheerio = require('cheerio');

// Create our express server app
const app = express();
// Listen on port x
const PORT = process.env.PORT || 5000;

// body parser - make JSON easy
app.use(bodyParser.json());

// end point for downloading an image or video
app.route("/instaloot").post((req, response) => {
    console.log(req.body);

    if (req.body.url) {
        // TODO: validate instagram url
        let options = {
            uri: req.body.url,
            transform: (body) => {
                return cheerio.load(body);
            }
        }
        
        rp(options)
            .then(($) => {
                let responseUrl = "";
                // looking for <meta property="og:image" content="https://instagram.fsyd4-1.fna.fbcdn.net/t51.2885-15/e35/22858066_286933651813045_6833344662162374656_n.jpg" />
                let imageMeta = $('meta[property="og:image"]');
                let videoMeta = $('meta[property="og:video"]');

                if (videoMeta.length > 0) {
                    responseUrl = videoMeta.attr("content");
                }
                else {
                    responseUrl = imageMeta.attr("content");
                }

                response.status(200).send(responseUrl);
            })
            .catch((err) => {
                throw err;
            });
    }
    else {
        response.status(500).send("No URL provided");
    }
});

// Server all files from current folder
app.use("/", express.static(__dirname + "/"));

// Listen
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});