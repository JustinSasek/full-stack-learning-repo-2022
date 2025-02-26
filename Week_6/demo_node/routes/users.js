/** Module for handling users */
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');


// Define route and middleware
const users = express.Router();
users.use(cors());
users.use(express.json());

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
    // Arbitrarily defined fields for user
    this.requiredFields = () => {
      return ["username", "password"];
    };
  }
}

// Fake database which we will be interacting with, key is the username
let fakeUsers = {
  jwong10: {
    username: "jwong10",
    password: "jwong10",
  },
  frey: {
    username: "frey",
    password: "frey",
  },
};

users.get("/", (req, res) => {
  let userDB = fakeUsers;
  res.status(200).json(userDB);
});

// TODO: Integrate with Error Handler
users.get("/:user_id", (req, res, next) => {
  let userDB = fakeUsers;
  const user = req.params.user_id;
  if (userDB[user]) {
    res.status(200).json(userDB[user]);
  } else {
    throw Error("User not found");
  }
}, middleware.handleErrors);

// TODO add POST (Create) route with json input validation middleware

// users.post("/new_user", middleware.validateSchema(User), (req, res, next) => {
//   res.json();
// })

users.post("/new_user", middleware.validateSchema(User), (req, res) => {
  console.log(req.body.username);
  console.log(req.body.password);
  let newUsername = req.body.username;
  if (fakeUsers[newUsername] == undefined) {
    fakeUsers[newUsername] = {
      username: newUsername,
      password: req.body.password
    };
    res.status(200).send("Success");
  }
  else {
    res.status(401)
    res.send("Username already created");
  }
})

// Export Route
module.exports = users;
