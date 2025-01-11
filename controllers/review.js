const db = require("../db");

async function handleAddReview(req, res) {
  const { movie_id, user_id, rating, review_text } = req.body;

  if (!movie_id || !rating || !review_text || !user_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  console.log({
    movie_id,
    user_id,
    rating,
    review_text,
  });

  // Create new review
  const query =
    "INSERT INTO reviews (movie_id, user_id, rating, review_text) VALUES (?, ?, ?, ?)";
  db.query(query, [movie_id, user_id, rating, review_text], (err) => {
    if (err)
      return res.status(500).json({ error: "Review creation failed", err });
    res.status(201).json({ message: "Review created successfully" });
  });
}

async function handleUpdateReview(req, res) {
  const { review_id, rating, review_text } = req.body;
  const { user_id } = req.body; // Assuming user_id is passed in request body

  console.log("handleUpdateReviewLog : ", req.body);

  // Validate required fields
  if (!review_id || !rating || !review_text || !user_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // First verify the review exists and belongs to the user
  const checkQuery =
    "SELECT * FROM reviews WHERE review_id = ? AND user_id = ?";

  db.query(checkQuery, [review_id, user_id], (checkErr, checkResults) => {
    if (checkErr) {
      return res.status(500).json({
        error: "Error verifying review ownership",
        checkErr,
      });
    }

    if (checkResults.length === 0) {
      return res.status(404).json({
        error: "Review not found or you don't have permission to edit it",
      });
    }

    // If verification passes, update the review
    const updateQuery = `
      UPDATE reviews 
      SET rating = ?, review_text = ? 
      WHERE review_id = ? AND user_id = ?
    `;

    db.query(
      updateQuery,
      [rating, review_text, review_id, user_id],
      (updateErr, updateResult) => {
        if (updateErr) {
          return res.status(500).json({
            error: "Failed to update review",
            updateErr,
          });
        }

        if (updateResult.affectedRows === 0) {
          return res.status(404).json({
            error: "Review update failed",
          });
        }

        res.status(200).json({
          message: "Review updated successfully",
        });
      }
    );
  });
}


async function handleGetMovieReviews(req, res) {
  const { movie_id } = req.params;

  // Query to get all reviews for a specific movie
  const query = `
    SELECT reviews.*, users.username 
    FROM reviews 
    JOIN users ON reviews.user_id = users.user_id 
    WHERE movie_id = ?
    ORDER BY created_at DESC
  `;

  db.query(query, [movie_id], (err, results) => {
    if (err) {
      return res.status(500).json({ 
        error: "Failed to fetch reviews",
        err 
      });
    }

    res.status(200).json(results);
  });
}

module.exports = {
  handleAddReview,
  handleUpdateReview,
  handleGetMovieReviews,
};
