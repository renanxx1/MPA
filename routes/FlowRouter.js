const express = require("express");
const router = express.Router();
const FlowController = require('../controllers/FlowController');

router.get('/fluxo', FlowController.getIndex);


module.exports = router;