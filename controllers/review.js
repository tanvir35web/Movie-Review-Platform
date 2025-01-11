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
    if (err) return res.status(500).json({ error: "Review creation failed" });
    res.status(201).json({ message: "Review created successfully" });
  });
}

module.exports = {
  handleAddReview,
};
