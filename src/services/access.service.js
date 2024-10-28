const express = require("express");
const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../ultis");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require("../core/error.response");
const ShopService = require("../services/shop.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signIn = async ({ email, password, refreshToken = null }) => {
    const shop = await ShopService.findByEmail({ email });
    if (!shop) throw new BadRequestError("Error: Use not registered");

    const match = bcrypt.compare(password, shop.password);

    if (!match) throw new AuthFailureError("Authentication error");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { shopId: shop._id },
      publicKey,
      privateKey
    );

    await KeyTokenService.updateKeyToken({
      shopId: shop._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: shop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      // check email exist
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        throw new BadRequestError("Error: Shop already registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.Shop],
      });

      if (newShop) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // create token pair || accessToken and refreshToken
        const tokens = await createTokenPair(
          { shopId: newShop._id },
          publicKey,
          privateKey
        );

        // save keyToken model
        const keyStore = await KeyTokenService.createKeyToken({
          shopId: newShop._id,
          publicKey,
          privateKey,
          refreshToken: tokens.refreshToken,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxxxx",
        message: error.message,
        status: "error",
      };
    }
  };

  static logOut = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  static handlerRefreshToken = async (refreshToken) => {
    //check this token used?
    const foundToken = await KeyTokenService.findByRefreshTokenUsed(
      refreshToken
    );
    if (foundToken) {
      // decode

      const { shopId } = await verifyJWT(refreshToken, foundToken.privateKey);

      // delete keytoken
      await KeyTokenService.deleteKeyById(shopId);

      throw new ConflictRequestError("Something went wrong ");
    }

    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);

    if (!holderToken) {
      throw new AuthFailureError("Shop not registered");
    }

    const { shopId } = await verifyJWT(refreshToken, holderToken.privateKey);
    // check shopId
    const foundShop = await ShopService.findById(shopId);
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // create token pair || accessToken and refreshToken
    const tokens = await createTokenPair(
      { shopId },
      holderToken.publicKey,
      holderToken.privateKey
    );

    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      shop: { shopId },
      tokens,
    };
  };
}

module.exports = AccessService;
