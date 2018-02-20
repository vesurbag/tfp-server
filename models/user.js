const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcryptjs");
const config = require("../config/database.js");

// User Schema
const UserSchema = mongoose.Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.plugin(AutoIncrement, { inc_field: "publicId" });

const User = (module.exports = mongoose.model("User", UserSchema));

module.exports.getUserById = (id, callback) => {
  User.findById(id, callback);
};

module.exports.getUserByEmail = (email, callback) => {
  const query = { email };
  User.findOne(query, callback);
};

module.exports.addUser = function(newUser, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
};

module.exports.getAllUsers = callback => {
  User.find(callback);
};

module.exports.comparePassword = (candidatePasswords, hash, callback) => {
  bcrypt.compare(candidatePasswords, hash, (err, isMatch) => {
    if (err) throw err;
    callback(null, isMatch);
  });
};
