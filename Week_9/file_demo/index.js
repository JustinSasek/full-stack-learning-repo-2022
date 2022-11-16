var express = require("express");
const app = express();
const files_routes = require("./routes/files");
app.use("/files", files_routes);

app.listen(process['PORT'], () => {
  console.log("app is listening on port " + process['PORT']);
});
