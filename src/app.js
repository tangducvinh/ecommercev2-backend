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
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init router
app.use("", require("./routes"));

// handle error

module.exports = app;
