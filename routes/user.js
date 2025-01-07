const express = require('express');
const router = express.Router();
const {
    handleRegisterUser,
    handleProtectedRoute,
    handleLoginUser } = require('../controllers/user');



router.post('/login', handleLoginUser);
router.post('/register', handleRegisterUser);
router.get('/protected', handleProtectedRoute);



module.exports = router;