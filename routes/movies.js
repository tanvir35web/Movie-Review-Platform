const express = require('express');
const router = express.Router();
const upload = require('../multerConfig');

const { handleGetAllMovies,
    handleGetMovieById,
    handleCreateMovie,
    handleUpdateMovie,
    handleDeleteMovie, 
    handleMostRatedMovie} = require('../controllers/movies');


router.get('/', handleGetAllMovies);
router.get('/top-rated', handleMostRatedMovie);

router.get('/:id', handleGetMovieById);
router.post('/', upload.single('poster_photo'), handleCreateMovie);
router.patch('/:id', upload.single('poster_photo'), handleUpdateMovie);
router.delete('/:id', handleDeleteMovie);


module.exports = router;