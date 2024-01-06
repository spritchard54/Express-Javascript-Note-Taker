const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');
const uuid = require('./helpers/uuid');
const app = express();
const dataBase = require('./db/db.json');
const PORT = 3001;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --------------------------- Get starts here ------------------------------------

// Retrieves /notes when you click 'Get Started' Button on 'index.html'
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
    // Log our request to the terminal
    console.info(`${req.method} request received`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    // Log our request to the terminal
    console.info(`${req.method} request received`);
});

// GET notes from json file and display old notes on /notes.html
app.get('/api/notes', (req, res) => {
    res.json(dataBase);
});

// --------------------------- Post starts here ------------------------------------

app.post('/api/notes', async (req, res) => {

    const oldNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const { title, text } = req.body;

    if (title && text) {
        // Variable for the object we will save
        let newNote = {
            id: uuid(),
            title: title,
            text: text
        };

        oldNotes.push(newNote);
        fs.writeFileSync('db/db.json', JSON.stringify(oldNotes));
        res.json(oldNotes);

        // Log our request to the terminal
        console.info(`${req.method} request received`);
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




// deletes old notes /:id = request paramter
app.delete("/notes/:id", (req, res) => {
    console.log('app.delete');
    const id = req.params.id
    let oldNotes = JSON.parse(fs.readFileSync('db.json'));
    // Find the index of the record with the given id
    const index = oldNotes.findIndex(record => record.id === parseInt(id));
    if (index !== -1) {
        // Remove the record from the array
        data.splice(index, 1);
        res.status(200).json({ message: 'Record deleted successfully' });
    } else {
        res.status(404).json({ message: 'Record not found' });
    }
});

app.listen(PORT, () =>
    console.log(`Steve's server is running at http://localhost:${PORT}`)
);
