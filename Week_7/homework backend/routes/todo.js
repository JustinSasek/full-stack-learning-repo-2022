
/** Module for handling todos */
const firebase = require("../firebase");
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');
const { random } = require("underscore");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const db = firebase.firestore;


// Define route and middleware
const todo = express.Router();
todo.use(cors());
todo.use(express.json());

class Item {
  constructor(todo) {
    this.todo = todo;
    // Arbitrarily defined fields for user
    this.requiredFields = () => {
      return ["todo"];
    };
  }
}


todo.get("/", middleware.authMiddleware, async (req, res) => {
  console.log('retrieving data');
  const todo_items = db.collection("todo-items");
  const query = await todo_items.where('email', '==', req.email).get();
  const ret = query.docs.map((data) => data.data());

  res.status(200).json(ret);

});

todo.delete("/", middleware.authMiddleware, async (req, res) => {
  console.log('deleting', req.body.uid);
  req.body.uid = req.body.uid.toString();

  const doc = await db.collection("todo-items").doc(req.body.uid).get()

  if (doc.exists) {
    await db.collection("todo-items").doc(req.body.uid).delete();
    res.status(200).json({
      msg: "Todo " + req.body.uid + " successfully deleted"
    });
  }
  else {
    res.status(400).json({
      msg: "failed to delete"
    });
  }

});



todo.post("/", middleware.authMiddleware, middleware.validateSchema(Item), (req, res) => {
  console.log('adding', req.body.todo);
  uid = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;


  db.collection("todo-items").doc('' + uid).set({
    uid: uid,
    todo: req.body.todo,
    email: req.email
  })
    .then(() => {
      res.status(201).json({
        msg: "item created",
        uid: uid
      });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      res.status(400).send("Failed to add");
    });


  // if (fakeUsers[newUsername] == undefined) {
  //   fakeUsers[newUsername] = {
  //     username: newUsername,
  //     password: req.body.password
  //   };
  //   res.status(200).send("Success");
  // }
  // else {
  //   res.status(401)
  //   res.send("Username already created");
  // }
})

// Export Route
module.exports = todo;
