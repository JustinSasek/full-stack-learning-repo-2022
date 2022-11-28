
/** Module for handling pics */
const firebase = require("../firebase");
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');
const { random } = require("underscore");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const db = firebase.firestore;
const multer = require("multer");


// Define route and middleware
const pic = express.Router();
pic.use(cors());
pic.use(express.json());

// class Item {
//   constructor(pic) {
//     this.pic = pic;
//     // Arbitrarily defined fields for user
//     this.requiredFields = () => {
//       return ["pic"];
//     };
//   }
// }




pic.post("/", multer().single("pic"), middleware.authMiddleware, async (req, res) => {
  console.log('adding pic');
  const file = req.file;
  if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
    res.status(401).send("Not jpeg or png");
    return;
  }
  console.log(file);

  var storageRef = firebase.storage().ref();
  var ref = storageRef.child('images/space.jpg');
  ref.put(file.buffer).then((snapshot) => {
    console.log('Uploaded an array!');
  })
    .then(() => {
      res.status(201).send("image updated");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
      res.status(400).send("Failed to add");
    });
  // uid = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

  // db.collection("pic-items").doc('' + uid).set({
  //   uid: uid,
  //   pic: req.body.pic,
  //   email: req.email
  // })
  //   .then(() => {
  //     res.status(201).json({
  //       msg: "item created",
  //       uid: uid
  //     });
  //   })
  //   .catch((error) => {
  //     console.error("Error writing document: ", error);
  //     res.status(400).send("Failed to add");
  //   });


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
module.exports = pic;
