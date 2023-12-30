const express = require('express');
// import the test data
const db = require("./testdb.json");
const fs = require("fs/promises");

const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

// GET /island/turtle
app.get('/island/turtle', (req, res) => {
  res.json(db);//??? test using new data
})

// POST /island/turtle
app.post('/island/turtle', (req, res) => {
  console.log(req.body);
  // res.json("Got something");
  const { name, descrip} = req.body;
  if(name.length > 0 && descrip.length > 0){
    // valid data
    const createdTurtle = {
      // id: uuid(),
      name,
      descrip
    };
    db.push(createdTurtle);
    return fs.writeFile('./testdb.json', JSON.stringify(db))
    .then(() => {
      console.log("Wrote file success");
      res.json(createdTurtle);
    });
  }
  //invalid data
  return res.status(400).json("Bad data input");
});

app.listen(PORT, () => {
  console.log(`app is listening on http://localhost:${PORT}`);
})