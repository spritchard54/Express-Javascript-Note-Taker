console.log("test");

fetch("/island/turtle", {
  method: "GET"
})
.then( resp => {
  return resp.json();
})
.then( data => {
  console.log(data);
})