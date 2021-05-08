const express = require("express");
const router = express.Router();
const CollectorController = require('../controllers/CollectorController');
const collaboratorAuth = require("../middlewares/collaboratorAuth");

router.get('/coletor/:process', collaboratorAuth, CollectorController.getIndex);


module.exports = router;