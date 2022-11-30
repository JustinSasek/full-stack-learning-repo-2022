
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

pic.get("/:file_name", middleware.authMiddleware, async (req, res) => {
  try {
    // Specify where to download the file to
    const file_name = req.params.file_name;
    const file_location = path.join(__dirname, "../files", file_name);
    const downloadOption = {
      destination: file_location,
    };
    // Checks if the file exists on the server, retrieves from bucket if it doesn't
    // if (!fs.existsSync(file_location)) {
    //   fs.unlinkSync(file_location);
    //   // Downloads the File from the bucket, throws an exception if it doesn't exist
    // }
    await bucket.file(file_name).download(downloadOption);

    // Return the file
    return res.status(200).sendFile(file_location);
  } catch (e) {
    console.log(e);
    return res.status(404).send("No such file exists");
  }
})

// Export Route
module.exports = pic;
