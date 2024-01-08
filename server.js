const express = require('express')
const fs = require('fs')
// const util = require('util')
const path = require('path')
const uuid = require('./helpers/uuid')
const app = express()
const dataBase = require('./db/db.json')
const { title } = require('process')
const PORT = process.env.PORT || 3001

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --------------------------- Get starts here ------------------------------------

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'index.html'))
  // Log our request to the terminal
  console.info(`${req.method} 1. app.get('/' index.html request received`)
})

// Retrieves /notes when you click 'Get Started' Button on 'index.html'
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public', 'notes.html'))
  // Log our request to the terminal
  console.info(`${req.method} 2. app.get('/notes.html request received`)
})

// GET notes from json file and display old notes on /notes.html
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './db', 'db.json'))
  console.info(`${req.method} 3. /api/notes received`)
})

// --------------------------- Post starts here ------------------------------------

app.post('/api/notes', (req, res) => {
  const oldNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'))
  const { title, text } = req.body

  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      id: uuid(),
      title,
      text
    }

    console.log(newNote);

    oldNotes.push(newNote)
    fs.writeFileSync('./db/db.json', JSON.stringify(oldNotes))
    res.json(oldNotes)

    // Log our request to the terminal
    console.info(`newNote ${req.method} request received`)
    const response = {
      status: 'success',
      body: newNote
    }
    console.log(response)
    res.status(201).json(response)
  } else {
    res.status(500).json('Error in posting note')
  }
})

// deletes old notes /:id = request paramter
app.delete('/api/notes/:id', (req, res) => {
  const id = req.params.id
  const oldNotes = JSON.parse(fs.readFileSync('./db/db.json'))
  const filteredNotes = oldNotes.filter((note) => note.id !== id)
  fs.writeFileSync('./db/db.json',JSON.stringify(filteredNotes))
  res.json({ok: true});
})

app.listen(PORT, () =>
  console.log(`Steve's server is running at http://localhost:${PORT}`)
)
