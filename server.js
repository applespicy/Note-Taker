const express = require("express");
const path = require("path"); 
const fs = require("fs");
const util = require("util");
const { parse } = require("path");


const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile)


// setting up server

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static("./public"));

app.get("/api/notes", function(req, res){
    readFileAsync("./db/db.json", "utf8").then(function(data){
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

app.post("/api/notes", function(req, res){
    const note = req.body;
    readFileAsync("./db/db.json", "utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        note.id = notes.lenght + 1
        notes.push(note);
        return notes
    }).then(function(notes){
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

app.delete("/api/notes/:id", function(req, res){
    const idToDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json","utf8").then(function(data){
        const notes = [].concat(JSON.parse(data));
        const newNotesData = [];
        for (let i =0; i<notes.length; i++) {
            if (idToDelete !== notes[i].id){
                newNotesData.push(notes[i])
            }
        }
        return newNotesData
    }).then(function(notes){
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.send('saved success')
    })
});

// HTML routes
app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});
app.get("*", function(req, res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, function(){
    console.log("App listening on PORT" + PORT);
});