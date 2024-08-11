import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

// enables all CORS requests
// read: https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// send your own data, the data sent is represented as a JS Object
app.get("/", (req, res) => {
  const data = { key: "Ahmed", id: 1 };
  res.send(data);
});

app.get("/test", (req, res) => {
  try {
    res.send("Wow!");
  } catch (error) {
    console.log("err");
  }
});

// ignore this, testing if it's possible to send
// data from the app back to the server

// app.post("/", (req, res) => {
//   res.send("Got a POST request");
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
