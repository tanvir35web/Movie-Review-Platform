const express = require("express");
const { handleAddReview, handleUpdateReview, handleGetMovieReviews } = require("../controllers/review");
const router = express.Router();

router.get('/:movie_id', handleGetMovieReviews);
router.post("/", handleAddReview);
router.patch("/", handleUpdateReview)

module.exports = router;
