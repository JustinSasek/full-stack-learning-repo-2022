
/** Module for handling pics */
const firebase = require("../firebase");
var admin = require('firebase-admin');
const { getStorage, ref, uploadBytes } = require("firebase/storage");

const fs = require('fs');
const express = require("express");
const cors = require("cors");
const middleware = require('../middleware/functions');
const { random } = require("underscore");
const { addConsoleHandler } = require("selenium-webdriver/lib/logging");
const db = firebase.firestore;
const bucket = firebase.bucket;
const multer = require("multer");
const path = require("path");
// const { ref } = require("firebase-admin");
// var { getStorage } = require("firebase-admin/stor");
// const { storage } = require("firebase-admin");
// var admin = require("firebase-admin");

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




pic.post("/", middleware.authMiddleware, multer().single("pic"), async (req, res) => { //middleware.authMiddleware,
  console.log('adding pic');
  const file = req.file;
  if (file.mimetype != 'image/jpeg' && file.mimetype != 'image/png') {
    res.status(401).send("Not jpeg or png");
    return;
  }
  // console.log(file.fieldname);

  if (file == null) {
    res.status(401).send("File is null");
    return;
  }

  const c = await bucket.file(req.file.originalname).save(req.file.buffer);
  res.status(201).send("File uploaded");

})

// Export Route
module.exports = pic;
