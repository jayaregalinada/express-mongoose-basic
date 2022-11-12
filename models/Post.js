import mongoose from 'mongoose';
import User from './User.js';

const { Schema, model } = mongoose;

const postSchema = new Schema({
  title: String,
  content: String,
  authorId: {
    type: Schema.Types.ObjectId,
    ref: User,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

postSchema.statics.getAllByAuthorId = async function (userId, limit, offset) {
  const pipelines = [
    {
      $match: {
        authorId: mongoose.Types.ObjectId(userId),
        deletedAt: {
          $eq: null,
        },
      },
    },
  ];

  // If limit is provided then push to pipelines
  if (limit !== undefined || !isNaN(limit)) {
    pipelines.push({
      $limit: parseInt(limit),
    });
  }
  // IF offset is provided then push to pipines
  if (offset !== undefined || !isNaN(offset)) {
    pipelines.push({
      $skip: parseInt(offset),
    });
  }

  return await this.aggregate(pipelines);
};

export default model('Post', postSchema);
