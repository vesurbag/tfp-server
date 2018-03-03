const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect to database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on("connected", () => {
  console.log(`Successfully connected to database ${config.database}`);
});

// On Error
mongoose.connection.on("error", err => {
  console.log(`Database error: ${err}`);
});

const app = express();

const users = require("./routes/users");
const dict = require("./routes/dict");

// Port Number
const port = 8080;

// CORS Middleware
app.use(
  cors({
    origin: function(origin, callback) {
      callback(null, true);
    },
    credentials: true
  })
);

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/dict", dict);

// Index Route
app.get("/", (req, res) => {
  res.send("Invalid Endpoint!");
});

// Start Server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
