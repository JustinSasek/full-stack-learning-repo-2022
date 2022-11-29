const { storage } = require("firebase-admin");
var { getStorage } = require("firebase-admin/storage");
var admin = require("firebase-admin");

var serviceAccount = require("./cred.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://todo-list-be033.appspot.com"
});

const firestore = admin.firestore();
const stor = getStorage(app);
console.log(stor);
module.exports = { firestore, stor};
