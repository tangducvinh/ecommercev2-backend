"use strict";

const { authentication } = require("../../auth/authUtils");
const CommentController = require("../../controllers/comment.controller");
const asyncHandler = require("../../helpers/asyncHandler");

const router = require("express").Router();

// authentication
router.use(authentication);

router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getComments));
router.delete("", asyncHandler(CommentController.deleteComment));

module.exports = router;
