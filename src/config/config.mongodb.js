"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3055,
  },
  db: {
    name: process.env.DEV_DB_USER || "ducvinh",
    password: process.env.DEV_DB_PASSWORD || "vinh051003",
    db: process.env.DEV_DB_NAME || "ecommercev2",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    name: process.env.PRO_DB_USER || "ducvinh",
    password: process.env.PRO_DB_PASSWORD || "vinh051003",
    db: process.env.PRO_DB_NAME || "ecommercev2",
  },
};

const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
