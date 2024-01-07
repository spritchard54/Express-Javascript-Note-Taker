const express = require('express')
const fs = require('fs')
// const util = require('util')
const path = require('path')
const uuid = require('./Develop/helpers/uuid')
const app = express()
const dataBase = require('./Develop/db/db.json')
const { title } = require('process')
const PORT = process.env.PORT || 3001

app.use(express.static(__dirname + '/develop/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --------------------------- Get starts here ------------------------------------

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public', 'index.html'))
  // Log our request to the terminal
  console.info(`${req.method} 1. app.get('/' index.html request received`)
})

// Retrieves /notes when you click 'Get Started' Button on 'index.html'
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/public', 'notes.html'))
  // Log our request to the terminal
  console.info(`${req.method} 2. app.get('/notes.html request received`)
})

// GET notes from json file and display old notes on /notes.html
app.get('/api/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './Develop/db', 'db.json'))
  console.info(`${req.method} 3. /api/notes received`)
})

// --------------------------- Post starts here ------------------------------------

app.post('/api/notes', (req, res) => {
  const oldNotes = JSON.parse(fs.readFileSync('./Develop/db/db.json', 'utf-8'))
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
    fs.writeFileSync('./Develop/db/db.json', JSON.stringify(oldNotes))
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
app.delete('api/notes/:id', (req, res) => {
  const id = req.params.id
  const oldNotes = JSON.parse(fs.readFileSync('db.json'))
  console.log(oldNotes);
  // Find the index of the record with the given id
  const index = oldNotes.findIndex(title => title.id === parseInt(id))
  if (index !== -1) {
    // Remove the record from the array
    oldNotes.splice(index, 1)
    res.status(200).json({ message: 'Record deleted successfully' })
  } else {
    res.status(404).json({ message: 'Record not found' })
  }
})

app.listen(PORT, () =>
  console.log(`Steve's server is running at http://localhost:${PORT}`)
)
