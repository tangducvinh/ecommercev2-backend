"use strict";

const CommentService = require("../services/comment.service");
const { SuccessResponse } = require("../core/success.response");

class CommentController {
  createComment = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new comment success",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  };
  getComments = async (req, res, next) => {
    new SuccessResponse({
      message: "Get success",
      metadata: await CommentService.getCommentsByParentId(req.query),
    }).send(res);
  };
  deleteComment = async (req, res, next) => {
    new SuccessResponse({
      message: "delete success",
      metadata: await CommentService.deleteComments(req.query),
    }).send(res);
  };
}

module.exports = new CommentController();
