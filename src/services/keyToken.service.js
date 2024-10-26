"use strict";

const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: new Types.ObjectId(userId),
        publicKey,
        privateKey,
        refreshToken,
      });

      // return tokens ? tokens.publicKey : null;

      // console.log({
      //   userId,
      //   publicKey,
      //   privateKey,
      //   refreshToken,
      // });

      // const filter = { user: new Types.ObjectId(userId) };
      // const update = { publicKey, privateKey, refreshToken };
      // const options = { upset: true, new: true };
      // const tokens = await keyTokenModel.findOneAndUpdate(
      //   filter,
      //   update,
      //   options
      // );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  static updateKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { user: new Types.ObjectId(userId) };
      const update = { publicKey, privateKey, refreshToken };
      const options = { upset: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  static findByUserId = async (userId) => {
    const res = await keyTokenModel
      .findOne({
        user: new Types.ObjectId(userId),
      })
      .lean();

    return res;
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete({ _id: id });
  };
}

module.exports = KeyTokenService;
