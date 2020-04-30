const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (request, response, next) => {
  response.render("index");
});

router.get("/demo-styling", (request, response) => {
  response.render("demo.hbs");
});

module.exports = router;
