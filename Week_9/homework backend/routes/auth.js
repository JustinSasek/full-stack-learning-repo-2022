
/** Module for handling authentication */
const firebase = require("../firebase");
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');
const { random } = require("underscore");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const pbk = require("pbkdf2");
const jwt = require("jsonwebtoken");
const db = firebase.firestore;


// Define route and middleware
const auth = express.Router();
auth.use(cors());
auth.use(express.json());

class Login {
  constructor(email, password) {
    this.email = email;
    this.password = password;
    // Arbitrarily defined fields for user
    this.requiredFields = () => {
      return ["email", "password"];
    };
  }
}

class Register {
  constructor(email, password, username) {
    this.email = email;
    this.password = password;
    this.username = username;
    // Arbitrarily defined fields for user
    this.requiredFields = () => {
      return ["email", "password", "username"];
    };
  }
}

auth.post("/register", middleware.validateSchema(Register), async (req, res) => {
  console.log("/register called");
  const SALT = process.env["SALT"];
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  const hash = pbk.pbkdf2Sync(password, SALT, 100, 32, "sha256").toString();

  if ((await db.collection("passwords").doc(email).get()).exists) {
    res.status(400).send("Email already exists");
    return;
  }

  db.collection("passwords").doc(email).set({
    username: username,
    hash: hash,
    salt: SALT
  })
    .then(() => {
      const token = jwt.sign({ "email": email }, process.env['TOKEN_KEY']);
      res.status(201).json({
        email: email,
        token: token,
        username: username
      });
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      res.status(400).send("Failed to add");
    });

})

auth.post("/login", middleware.validateSchema(Login), async (req, res) => {
  // console.log("/login called");
  const SALT = process.env["SALT"];
  const password = req.body.password;
  const email = req.body.email;

  const hash = pbk.pbkdf2Sync(password, SALT, 100, 32, "sha256").toString();

  const doc = await db.collection("passwords").doc(email).get();
  const docData = doc.data();
  if (doc.exists && docData.hash === hash && docData.salt == SALT) {
    const token = jwt.sign({ "email": email }, process.env['TOKEN_KEY']);

    res.status(201).json({
      email: email,
      token: token,
      username: docData.username
    });

  }
  else {
    res.status(400).send("Invalid Email/Password");
  }


})

// Export Route
module.exports = auth;
