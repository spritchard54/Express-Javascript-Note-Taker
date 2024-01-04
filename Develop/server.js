//Import Express.js
const express = require('express');
const fs = require('fs');
const util = require('util');
//Import built in Node.js package 'path' to reslve path of files that are located on the server.
const path = require('path');
// const router = require('express').Router();
const uuid = require('./helpers/uuid');
//Initialize an instance of Express.js
const app = express();
// allows server.js to access the database file 'db.json'
const dataBase = require('./db/db.json');
//Specify on which port the express.js server will run
const PORT = 3001;
//Middleware pointing to static files in the public folder. Creates routes for static files.
app.use(express.static('public'));

// Middleware for parsing application/json and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//'_dirname' is effectively './'
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// GET notes from json file an display on /notes.html
app.get('/api/notes', (req, res) => {
    res.json(dataBase);
    // console.log("This is the required path:" + "'" + req.path + "'");
});

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);


// POST request
app.post('/api/notes', async (req, res) => {
    // Let the client know that their POST request was received
    // res.json(`${req.method} request received`);

    const oldNotes = await readFile('./db/db.json', 'utf-8')
    // console.log(oldNotes);
    console.log('we are here');
    // Log our request to the terminal
    console.info(`${req.method} request received`);

    const { title, text } = req.body;
    console.log('you are there');
    console.log(req.body);
    console.log(uuid);
    // If all the required properties are present
    if (title && text) {
        // Variable for the object we will save
        const newNote = {
            id: uuid(),
            title: title,
            text: text
        };
        console.log(newNote);
        console.log(typeof JSON.parse(oldNotes));
        console.log(oldNotes + "These are the old notes");
        const parsedNotes = await JSON.parse(oldNotes);
        parsedNotes.push(newNote)
        writeFile('./db/db.json', JSON.stringify(parsedNotes));

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
       
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
});

app.listen(PORT, () =>
    console.log(`Steve's server is running at http://localhost:${PORT}`)
);
