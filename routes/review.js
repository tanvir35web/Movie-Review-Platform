const express = require("express");
const { handleAddReview } = require("../controllers/review");
const router = express.Router();

router.post("/", handleAddReview);

module.exports = router;
