const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/database");

const User = require("../models/user");
const validate = require("../validators/user");

// Register
router.post("/register", (req, res, next) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password
  });

  if (validate.isValidateUserRegister(newUser)) {
    User.addUser(newUser, (err, user) => {
      if (err) {
        res.json({
          success: false,
          msg: "Failed to register user"
        });
      } else {
        res.json({
          success: true,
          msg: "User regitered"
        });
      }
    });
  } else {
    res.json({
      success: false,
      msg: "Bad data"
    });
  }
});

// Authenticate
router.post("/authenticate", (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email, (err, user) => {
    if (err) throw err;
    if (!user) {
      return res.json({
        success: false,
        msg: "User not found"
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: `JWT ${token}`,
          user: {
            publicId: user.publicId,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
          }
        });
      } else {
        return res.json({
          success: false,
          msg: "Wrong password"
        });
      }
    });
  });
});

// Profile
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    res.json({
      user: req.user
    });
  }
);

router.get(
  "/authenticate/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      success: true,
      publicId: req.user.publicId
    });
  }
);

// User for public

router.get("/user/:id", (req, res) => {
  User.getUserByPublicId(req.params.id, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.json({
        success: false,
        msg: "User not found"
      });
    } else {
      res.json({
        success: true,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          publicId: user.publicId
        }
      });
    }
  });
});

router.get("/all", (req, res) => {
  User.getAllUsers((err, user) => {
    res.send(user);
  });
});

module.exports = router;
