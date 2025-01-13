const express = require("express");
const { handleAddReview, handleUpdateReview, handleGetMovieReviewsByUserId } = require("../controllers/review");
const router = express.Router();

router.get('/:movie_id', handleGetMovieReviewsByUserId);
router.post("/", handleAddReview);
router.patch("/", handleUpdateReview)

module.exports = router;
