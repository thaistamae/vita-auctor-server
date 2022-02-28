const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, match: /\s/gm },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i,
  },
  passwordHash: { type: String, required: true },
});

const UserModel = model("User", userSchema);

module.exports = UserModel;
