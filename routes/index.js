var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function(req, res) {
  res.render("index", { title: "playwright-continue" });
});

router.get("/api/foo/sse", function(req, res) {
  console.log("This real API isn't called in Playwright test, it's mocked");
});

module.exports = router;
