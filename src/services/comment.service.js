"use strict";

const { convertToObjectMongodb } = require("../ultis");
const commentModel = require("../models/comment.model");
const { NotFoundError } = require("../core/error.response");

class CommentService {
  // create comment
  async createComment({ productId, userId, content, parentCommentId = null }) {
    const comment = await commentModel.create({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      // reply comment
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Not found parent");

      rightValue = parentComment.comment_right;

      // update many
      await commentModel.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        },
        {
          new: true,
        }
      );

      await commentModel.updateMany(
        {
          comment_productId: convertToObjectMongodb(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        },
        {
          new: true,
        }
      );
    } else {
      // const maxRightValue = await comment.findOne(
      //   {
      //     comment_productId: convertToObjectMongodb(productId),
      //   },
      //   // "comment_right",
      //   { $sort: { comment_right: -1 } }
      // );

      // if (maxRightValue) {
      //   rightValue = maxRightValue + 1;
      // } else {
      //   rightValue = 1;
      // }
      rightValue = 1;
    }

    // insert to comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  async getCommentsByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0,
  }) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);
      if (!parent) throw new NotFoundError("Not found comment for product");

      const comments = await commentModel
        .find({
          comment_parentId: convertToObjectMongodb(parentCommentId),
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lt: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        })
        .limit(limit)
        .skip(offset);

      return comments;
    }

    const comments = await commentModel
      .find({
        comment_productId: convertToObjectMongodb(productId),
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .limit(limit)
      .skip(offset)
      .sort({
        comment_left: 1,
      })
      .lean();

    console.log({ comments });

    return comments;
  }

  async deleteComments({ commentId, productId }) {
    const foundComment = await commentModel.findById(commentId);
    if (!foundComment) throw NotFoundError("Not found comment");

    const right = foundComment.comment_right;
    const left = foundComment.comment_left;

    await commentModel.deleteMany({
      comment_productId: convertToObjectMongodb(productId),
      comment_left: { $gte: left },
      comment_right: { $lte: right },
    });

    await commentModel.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_right: { $gt: right },
      },
      {
        $inc: {
          comment_right: -(right - left + 1),
        },
      }
    );

    await commentModel.updateMany(
      {
        comment_productId: convertToObjectMongodb(productId),
        comment_left: { $gt: left },
      },
      {
        $inc: {
          comment_left: -(right - left + 1),
        },
      }
    );

    return true;
  }
}

module.exports = new CommentService();
