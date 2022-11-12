// ES Modules
import mongoose from 'mongoose';
// Common JS
// const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

// Common JS
// module.exports = userSchema;
// ES Modules
export default model('User', userSchema);