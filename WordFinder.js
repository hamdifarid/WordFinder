var express = require("express");
var app = express();
var cors = require('cors');
app.use(cors());
var bodyParser = require('body-parser');
app.use(bodyParser.json());
const fs = require('fs');


const { exec } = require("child_process");
exec("WordFinder.html", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
});

app.use(express.static("public"));
app.listen(process.env.PORT || 3000,
    () => console.log("Server is running..."));




app.get("/", (req, res) => {
    res.sendFile(__dirname + "/WordFinder.html");
});

app.get("/get_word", (req, res) => {

    var word = req.query.word;
    var word = word.toLowerCase();

    var words = fs.readFileSync('words_alpha.txt').toString().split("\n");
    var words = words.filter(function (el) {
        return el.includes(word);
    });
    var words = words.filter(function (el) {
        return el.startsWith(word);
    });
    var words = words.filter(function (el) {
        return el != word;
    });

    /*
    var words = words.filter(function (el) {
        var wordArray = word.split("");
        var elArray = el.split("");
        var result = wordArray.every(function (val) {
            return elArray.indexOf(val) != -1;
        });
        return result;
    });
*/

    var words = words.map(function (el) {
        return el.replace(/(\r\n|\n|\r)/gm, "");
    });
    //console.log(words);
    res.send(words);
});

/*
app.post("/get_word_scribble", (req, res) => {
    //get body of the request
    var body = req.body;
    var num_of_letters = body.num_words;
    var letters = body.letters;
    var words = fs.readFileSync('words_alpha.txt').toString().split("\n");
    var words = words.filter(function (el) {
        return (el.length - 1) == num_of_letters;
    });
    var words = words.filter(function (el) {
        var wordArray = letters.split("");
        var elArray = el.split("");
        var result = wordArray.every(function (val) {
            return elArray.indexOf(val) != -1;
        });
        return result;
    }
    );
    var words = words.map(function (el) {
        return el.replace(/(\r\n|\n|\r)/gm, "");
    });
    res.send(words);
});
*/

app.get("/get_word_scribble_find", (req, res) => {
    var words = fs.readFileSync('words_alpha.txt').toString().split("\n");
    var word = req.query;
    var word = word.word;
    var word = word.toLowerCase();
    var length = word.length;
    //console.log(length)

    var words = words.filter(function (el) {
        return el.length == length + 1;
    });
    for (var i = 0; i < length; i++) {
        var words = words.filter(function (el) {
            if (word[i] != "_") {
                return el[i] == word[i];

            }
            else {
                return true;
            }
        });
    }
    var words = words.map(function (el) {
        return el.replace(/(\r\n|\n|\r)/gm, "");
    });

    res.send(words);
});
