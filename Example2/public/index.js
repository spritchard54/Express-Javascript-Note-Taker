console.log("test");
const list = document.querySelector("#island-list");
const formTag = document.querySelector("#turtle-form");
const nameInput = document.querySelector("#name");
const descripInput = document.querySelector("#descrip");

fetch("/island/turtle", {
  method: "GET"
})
.then( resp => {
  return resp.json();
})
.then( data => {
  console.log(data);
  /* fake data */
  for(let i = 0; i < data.length; i++){
    // create
    let li = document.createElement("li");
  
    // change attr/text
    li.textContent = `${data[i].name}, ${data[i].descrip}`;
  
    //append
    list.appendChild(li);
  }
  // <li>Turtle1, Some Data Point</li>
  //   <li>Turtle2, Some Other Data Point</li>
});

const postTurtle = (turtle) => 
  fetch("/island/turtle", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(turtle)
});

const saveTurtle = (event) => {
  event.preventDefault();
  const createdTurtle = {
    name: nameInput.value,
    descrip: descripInput.value
  }
  console.log(createdTurtle);
  return postTurtle(createdTurtle)
  .then( resp => {
    return resp.json();
  })
  .then( data => {
    console.log(data);
    // would have to re-write this to actually do another get request for all data again...
    // currently the code below is bugged
    // /* fake data */
    // for(let i = 0; i < data.length; i++){
    //   // create
    //   let li = document.createElement("li");
    
    //   // change attr/text
    //   li.textContent = `${data[i].name}, ${data[i].descrip}`;
    
    //   //append
    //   list.appendChild(li);
    // }
    // // <li>Turtle1, Some Data Point</li>
    // //   <li>Turtle2, Some Other Data Point</li>
  })
}

formTag.addEventListener("submit", saveTurtle);