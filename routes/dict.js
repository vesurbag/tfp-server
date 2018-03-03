const express = require("express");
const router = express.Router();

const cities = require("../dictionaries/cities");

router.get("/cities", (req, res) => res.json(cities));

module.exports = router;
