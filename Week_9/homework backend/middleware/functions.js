
const jwt = require("jsonwebtoken");

/** Main functions for middleware */
function validateSchema(obj) {
  return (req, res, next) => {
    let objFields = new obj().requiredFields();
    let jsonBody = req.body;
    let fieldsNotContained = [];
    objFields.forEach((field) => {
      if (!jsonBody.hasOwnProperty(field)) {
        fieldsNotContained.push(field);
      }
    });
    // Contains all fields
    if (fieldsNotContained.length === 0) {
      let jsonObj = new obj(...Object.values(jsonBody));
      req.body = jsonObj;
      next();
    } else {
      let m = "JSON object does not contain " + fieldsNotContained;
      console.log(m);
      res.json({ msg: m });
    }
  };
}

function handleErrors(err, req, res, next) {
  //TODO: write an error handler that logs out the message of the error and returns it to the user
  console.log(err.stack);
  res.send(err.stack);
}

function authMiddleware(req, res, next) {
  console.log("next");
  // Check if proper header exists
  if (req.headers["authorization"]) {
    // Split on space -> should return ["Bearer", "${token}"]
    const headers = req.headers["authorization"].split(" ");
    // Check if first argument is Bearer
    if (headers.length === 2 && headers[0] === "Bearer") {
      // TODO: get the token
      let token = headers[1];
      try {

        let decodedToken = jwt.verify(token, process.env['TOKEN_KEY']);
        // Set user object which can be accessed in the req
        console
        req.email = decodedToken.email;
        next(); // Go to next function
      } catch (e) {
        return res.status(401).json({ msg: e.message });
      }
    } else {
      return res.status(401).json({ msg: "invalid token" });
    }
  } else {
    return res.status(401).json({ msg: "token was not found in header" });
  }
}

module.exports = { validateSchema, handleErrors, authMiddleware };
