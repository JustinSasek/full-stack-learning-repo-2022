/** Twitter Demo */
const firebase = require("./firebase");
const app = require("express")();
const db = firebase.firestore;
require("dotenv").config();

const PORT = process.env['PORT']  //imports PORT

// Define Routes
app.use("/todo", require("./routes/todo.js"));
app.use("/auth", require("./routes/auth.js"));



app.listen(process.env["PORT"], () =>
  console.log("App listening on port " + process.env["PORT"])
);
