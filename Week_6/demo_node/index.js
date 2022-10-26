// Global Import
const express = require("express");
// Module Import
const app = express();
app.use(express.json()); // Lets us use json in parsing the request
const dotenv = require("dotenv").config();  //loads the environment variables
const PORT = process.env['PORT']  //imports PORT

// Define Routes
app.use("/users", require("./routes/users.js"));

app.get("/", (req, res) => {  //request and respond objects
  res.status(201).json({ hello: "HELLO WORLD" });
});

// TODO: we are currently listening to the main port, lets define an environment variable and use that instead
app.listen(PORT, () => console.log("App listening on port " + PORT));
