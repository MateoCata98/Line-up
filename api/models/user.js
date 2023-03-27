const mongoose = require("mongoose")
const { isEmail } = require("validator")

const userSchema = new mongoose.Schema({
    dni: { type: Number },
    name: { type: String, required: true },
    email: {type: String, required: true, validate: [isEmail, "invalid email"]}, 
    phone: {type: Number , min: [9, "too few numbers"], maxLength: [15, "too many numbers"] , required: true},
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    operator: { type: Boolean, default: false }
  });

  const User = mongoose.model("user", userSchema)

  module.exports = User;