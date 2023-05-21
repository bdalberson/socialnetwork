const { Schema, Types } = require('mongoose');

const Thought = new Schema(
  {
    thoughttext: String,
    Date: Date,
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);



module.exports = Thought;
