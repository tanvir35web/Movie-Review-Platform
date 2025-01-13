const express = require('express');
const router = express.Router();
const {
    handleRegisterUser,
    handleProtectedRoute,
    handleLoginUser, 
    handleGetUserById} = require('../controllers/user');



router.post('/login', handleLoginUser);
router.post('/register', handleRegisterUser);
router.get('/protected', handleProtectedRoute);
router.get('/:user_id', handleGetUserById);



module.exports = router;