"use strict";

const keytokenModel = require("../models/keytoken.model");
const keyTokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const tokens = await keyTokenModel.create({
        shop: new Types.ObjectId(shopId),
        publicKey,
        privateKey,
        refreshToken,
      });

      // return tokens ? tokens.publicKey : null;

      // console.log({
      //   shopId,
      //   publicKey,
      //   privateKey,
      //   refreshToken,
      // });

      // const filter = { shop: new Types.ObjectId(shopId) };
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
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      const filter = { shop: new Types.ObjectId(shopId) };
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

  static findByShopId = async (shopId) => {
    const res = await keyTokenModel
      .findOne({
        shop: new Types.ObjectId(shopId),
      })
      .lean();

    return res;
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.findByIdAndDelete({ _id: id }).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static deleteKeyById = async (shopId) => {
    return await keyTokenModel.findOneAndDelete({ shop: shopId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };
}

module.exports = KeyTokenService;
