const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User schema
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  password: { type: String, required: true }
});

// User model
const User = mongoose.model('User', UserSchema);
module.exports = User;
