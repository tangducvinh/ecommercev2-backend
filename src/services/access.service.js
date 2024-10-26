const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../ultis");
const {
  BadRequestError,
  ConflictRequestError,
  AuthFailureError,
} = require("../core/error.response");
const { findByEmail } = require("./user.service");

const RoleUser = {
  USER: "USER",
  WRITER: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signIn = async ({ email, password, refreshToken = null }) => {
    const user = await findByEmail({ email });
    if (!user) throw new BadRequestError("Error: Use not registered");

    const match = bcrypt.compare(password, user.password);

    if (!match) throw new AuthFailureError("Authentication error");

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = await createTokenPair(
      { userId: user._id },
      publicKey,
      privateKey
    );

    await KeyTokenService.updateKeyToken({
      userId: user._id,
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });

    return {
      user: getInfoData({
        fields: ["_id", "name", "email"],
        object: user,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    try {
      // check email exist
      const holderUser = await userModel.findOne({ email }).lean();
      if (holderUser) {
        throw new BadRequestError("Error: User already registered");
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleUser.User],
      });

      if (newUser) {
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        // create token pair || accessToken and refreshToken
        const tokens = await createTokenPair(
          { userId: newUser._id },
          publicKey,
          privateKey
        );

        // save keyToken model
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newUser._id,
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
            user: getInfoData({
              fields: ["_id", "name", "email"],
              object: newUser,
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
}

module.exports = AccessService;
