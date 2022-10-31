/** Twitter Demo */
const firebase = require("./firebase");
const app = require("express")();
const db = firebase.firestore;
require("dotenv").config();

// app.post("/tweets", async (req, res) => {});

const PORT = process.env['PORT']  //imports PORT

// Define Routes
app.use("/todo", require("./routes/todo.js"));

// Gets all Tweets
// app.get("/", async (req, res) => {
//   const todo_items = db.collection("todo-items");

//   const items = await todo_items.get(); // Since async operation, use await
//   const ret = items.docs.map((data) => data.data());

//   res.json(ret);
// });

// Gets all tweets from today
// app.get("/tweets/today", async (req, res) => {
//   const todo_items = db.collection("tweets");

//   var d = new Date();
//   d.setDate(d.getDate() - 1);

//   const query = await todo_items.where("createdAt", ">=", d).get();
//   const ret = query.docs.map((data) => data.data());
//   res.json(ret);
// });

//TODO: Get all tweets by person id

//TODO: Create a tweet

app.listen(process.env["PORT"], () =>
  console.log("App listening on port " + process.env["PORT"])
);
