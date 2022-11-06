const firebase = require("./middleware/firebase");
const express = require("express");
const db = firebase.firestore;
const pbk = require("pbkdf2");
const app = express();
require("dotenv").config();
app.use(express.json());

// Should be stored in environment variable, but ok for this demo


// Creates a user with password, no checks needed
app.post("/password", async (req, res) => {
  console.log("/password received");
  const SALT = process.env["SALT"];
  // Get the username and password from request
  const { username, password } = req.body;

  const hash = pbk.pbkdf2Sync(password, SALT, 100, 64, 'sha256');
  await db.collection("passwords").doc(username).set({
    hash: hash,
    salt: SALT
  })
  // TODO: hash the password
  // Create the User
  // Send message indicating success
  res.send("User Created");
});

// Verifies password
app.post("/verifyPassword", async (req, res) => {
  console.log("/verifyPassword received");
  const SALT = process.env["SALT"];
  const { username, password } = req.body;
  // TODO: hash the password
  const hash = pbk.pbkdf2Sync(password, SALT, 100, 64, 'sha256').toString();
  // Set this to when you check the password
  const signInData = (await db.collection("passwords").doc(username).get()).data();
  signInData.hash = signInData.hash.toString();
  signInData.salt = signInData.salt.toString();

  let samePassword = signInData.hash === hash && signInData.salt === SALT;
  // Get the user
  // Cross check the user's password with the passwordHash
  // Send arbitrary message
  if (samePassword) {
    res.send("Password Verified!");
  } else {
    res.send("Password Invalid!");
  }
});

app.listen(process.env["PORT"], () => console.log("App listening on port " + process.env["PORT"]));
