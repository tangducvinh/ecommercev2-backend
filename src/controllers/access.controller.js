"use strict";
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  signIn = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  logOut = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metadata: await AccessService.logOut(req.keyStore),
    }).send(res);
  };
}

module.exports = new AccessController();
