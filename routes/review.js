const express = require("express");
const { handleAddReview, handleUpdateReview, handleGetMovieReviewsByUserId, handleGetMovieReviews } = require("../controllers/review");
const router = express.Router();

router.get('/:movie_id', handleGetMovieReviewsByUserId);
router.get('/all/:movie_id', handleGetMovieReviews);
router.post("/", handleAddReview);
router.patch("/", handleUpdateReview)

module.exports = router;
