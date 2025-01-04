const express = require('express');
const { handleGetAllMovies, handleGetMovieById, handleCreateMovie } = require('../controllers/movies');
const router = express.Router();



router.get('/', handleGetAllMovies);
router.get('/:id', handleGetMovieById);
router.post('/', handleCreateMovie);


module.exports = router;