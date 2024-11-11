const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
require("dotenv").config();
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

//test redis subscribe and publish
require("./tests/inventory.test");
const productTest = require("./tests/product.test");
productTest.purchaseProduct("product:001", 10);

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//init router
app.use("", require("./routes"));

// handle error
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const statusCode = err?.status || 500;
  console.log({ err });
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err?.message || "Not Found 1",
  });
});

module.exports = app;
