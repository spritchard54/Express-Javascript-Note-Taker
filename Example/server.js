const express = require('express');

const app = express();

const PORT = 3001;

app.use(express.static('public'));

// GET /island/turtle
app.get('/island/turtle', (req, res) => {
  res.json("Island turtle is here!!! woot api is good");
})

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
})