const db = require("../db");
const { imageUpload } = require("../services/imageUpload");

async function handleGetAllMovies(req, res) {
  db.query("SELECT * FROM Movies ORDER BY movie_id DESC", (err, results) => {
    if (err) {
      res.status(500).send("Database query error to get all movies");
      return;
    }
    res.status(200).json(results);
  });
}

async function handleGetMovieById(req, res) {
  const { id } = req.params;
  db.query("SELECT * FROM Movies WHERE movie_id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send("Database query error to get movie by id");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("Movie not found");
      return;
    }
    res.status(200).json(results[0]);
  });
}

async function handleCreateMovie(req, res) {
  if (
    !req.body.title ||
    !req.body.genre ||
    !req.body.release_date ||
    !req.body.director ||
    !req.body.synopsis
  ) {
    res.status(400).send("Missing required fields");
    return;
  }

  const { title, genre, release_date, director, synopsis } = req.body;
  const movie_poster = req.file ? await imageUpload(req) : null;

  db.query(
    "INSERT INTO Movies (title, genre, release_date, director, synopsis, poster_photo) VALUES (?, ?, ?, ?, ?, ?)",
    [title, genre, release_date, director, synopsis, movie_poster],
    (err, results) => {
      if (err) {
        res.status(500).send("Database query error to create movie");
        return;
      }
      res.status(201).json({
        massage: "Movie created successfully",
        data: {
          movie_id: results.insertId,
          title,
          genre,
          release_date,
          director,
          synopsis,
          movie_poster,
        },
      });
    }
  );
}

async function handleUpdateMovie(req, res) {
  const { id } = req.params;
  const { title, genre, release_date, director, synopsis } = req.body;
  const movie_poster = await imageUpload(req);

  db.query(
    "UPDATE Movies SET title = ?, genre = ?, release_date = ?, director = ?, synopsis = ?, poster_photo = ? WHERE movie_id = ?",
    [title, genre, release_date, director, synopsis, movie_poster, id],
    (err, results) => {
      if (err) {
        res.status(500).send("Database query error to update movie");
        return;
      }
      res.status(200).send("Movie updated");
    }
  );
}

async function handleDeleteMovie(req, res) {
  const { id } = req.params;
  db.query("DELETE FROM Movies WHERE movie_id = ?", [id], (err, results) => {
    if (err) {
      res.status(500).send("Database query error to delete movie");
      return;
    }
    res.status(200).send("Movie deleted");
  });
}

async function handleMostRatedMovie(req, res) {
    db.query(`
      SELECT Movies.*, AVG(Reviews.rating) as average_rating
      FROM Movies 
      JOIN Reviews ON Movies.movie_id = Reviews.movie_id 
      GROUP BY Movies.movie_id
      ORDER BY average_rating DESC 
      
    `, (err, results) => {
      if (err) {
        res.status(500).send("Database error to get most rated movie");
        return;
      }
      res.status(200).json(results);
    });
  }


  async function handleSearchMovies(req, res) {
    const { title } = req.query;
    
    db.query(`
      SELECT * FROM Movies 
      WHERE title LIKE ?
    `, [`%${title}%`], (err, results) => {
      if (err) {
        res.status(500).send("Database error to search movies");
        return;
      }
      res.status(200).json(results);
    });
  }
  
module.exports = {
  handleGetAllMovies,
  handleGetMovieById,
  handleCreateMovie,
  handleUpdateMovie,
  handleDeleteMovie,
  handleMostRatedMovie,
  handleSearchMovies,
};
