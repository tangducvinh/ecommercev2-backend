"use strict";
const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError } = require("../core/error.response");
const { findByShopId } = require("../services/keyToken.service");
const { NotFoundError } = require("../core/success.response");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // JWT.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.log("error verify: ", err);
    //   } else {
    //     console.log("decode verify: ", decode);
    //   }
    // });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const shopId = req.headers[HEADER.CLIENT_ID];
  if (!shopId) throw new AuthFailureError("Invalid Request");

  const keyStore = await findByShopId(shopId);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeShop = JWT.verify(accessToken, keyStore.publicKey);

    if (shopId !== decodeShop.shopId)
      throw new AuthFailureError("Invalid ShopId");
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  try {
    const res = await JWT.verify(token, keySecret);

    return res;
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
