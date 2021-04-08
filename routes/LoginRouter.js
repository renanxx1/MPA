const express = require("express");
const router = express.Router();
const LoginController = require('../controllers/LoginController');


router.get('/login', LoginController.login);
router.get('/logout', LoginController.logout);
router.post('/authenticate', LoginController.authenticate);



module.exports = router;