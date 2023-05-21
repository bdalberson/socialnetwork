const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: String,
    email: String,
    age: Number,
    applications: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Application',
      },
    ],
  },
  {
    // Mongoose supports two Schema options to transform Objects after querying MongoDb: toJSON and toObject.
    // Here we are indicating that we want virtuals to be included with our response, overriding the default behavior
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema
  .virtual('friendCount')
  .get(function () {
    return ;
  })
  
// Initialize our User model
const User = model('user', userSchema);

module.exports = User;
