const { Schema, model } = require('mongoose');

// Schema to create Post model
const reactionSchema = new Schema(
  {
    published: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    buildSuccess: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      minLength: 15,
      maxLength: 500,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

// Create a virtual property `getTags` that gets the amount of tags associated with an application
reactionSchema
  .virtual('getTags')
  // Getter
  .get(function () {
    return this.tags.length;
  });

// Initialize our Reaction model
const Reaction = model('reaction', reactionSchema);

module.exports = Reaction;
