const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// middelwares
app.use(morgan("dev"));
// app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init router
app.get("/", (req, res, next) => {
  const strCompress = "Hello everyone";

  return res.status(200).json({
    message: "Welcome",
    metadata: strCompress.repeat(10000),
  });
});

// handle error

module.exports = app;
