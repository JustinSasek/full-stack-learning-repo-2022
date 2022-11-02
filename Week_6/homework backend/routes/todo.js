
/** Module for handling todos */
const firebase = require("../firebase");
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');
const { random } = require("underscore");
const db = firebase.firestore;


// Define route and middleware
const todo = express.Router();
todo.use(cors());
todo.use(express.json());

class User {
  constructor(todo) {
    this.todo = todo;
    // Arbitrarily defined fields for user
    this.requiredFields = () => {
      return ["todo"];
    };
  }
}

// Fake database which we will be interacting with, key is the username

// {
//   jwong10: {
//     username: "jwong10",
//     password: "jwong10",
//   },
//   frey: {
//     username: "frey",
//     password: "frey",
//   },
// };

// todo.get("/", (req, res) => {
//   let userDB = fakeUsers;
//   res.status(200).json(userDB);
// });

todo.get("/", async (req, res) => {
  console.log('retrieving data');
  const todo_items = db.collection("todo-items");

  const query = await todo_items.get();  //.where("createdAt", ">=", d)
  const ret = query.docs.map((data) => data.data());

  res.status(200).json(ret);

  //   let userDB = fakeUsers;
  //   const todo = req.params.user_id;
  //   if (userDB[todo]) {
  //     res.status(200).json(userDB[todo]);
  //   } else {
  //     throw Error("User not found");
  //   }
});

todo.delete("/", async (req, res) => {
  console.log('deleting', req.body.uid);

  const doc = await db.collection("todo-items").doc(req.body.uid).get();
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

  // await deleteDoc(doc(db, "cities", "DC"));


  //   let userDB = fakeUsers;
  //   const todo = req.params.user_id;
  //   if (userDB[todo]) {
  //     res.status(200).json(userDB[todo]);
  //   } else {
  //     throw Error("User not found");
  //   }
});


// TODO add POST (Create) route with json input validation middleware

// users.post("/new_user", middleware.validateSchema(User), (req, res, next) => {
//   res.json();
// })

todo.post("/", middleware.validateSchema(User), (req, res) => {
  console.log('adding', req.body.todo);
  uid = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;


  db.collection("todo-items").doc('' + uid).set({
    uid: uid,
    todo: req.body.todo,
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
