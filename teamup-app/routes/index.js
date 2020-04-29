// jshint esversion:6

const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/demo-styling", (request, response) => {
  response.render("demo.hbs");
});

module.exports = router;
