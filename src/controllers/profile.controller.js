"use strict";

const { SuccessResponse } = require("../core/success.response");

const data = [
  {
    usr_id: 1,
    usr_name: "CR7",
    usr_avt: "image.com/user/1",
  },
  {
    usr_id: 2,
    usr_name: "M10",
    usr_avt: "image.com/user/2",
  },
  {
    usr_id: 3,
    usr_name: "CCC",
    usr_avt: "image.com/user/3",
  },
];

class ProfileController {
  // admin
  profiles = async (req, res, next) => {
    new SuccessResponse({
      message: "view all profile",
      metadata: data,
    }).send(res);
  };

  // shop
  profile = async (req, res, next) => {
    new SuccessResponse({
      message: "view all profile",
      metadata: {
        usr_id: 2,
        usr_name: "M10",
        usr_avt: "image.com/user/2",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
