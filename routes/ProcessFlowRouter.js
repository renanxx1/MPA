const express = require("express");
const router = express.Router();
const ProcessFlowController = require('../controllers/ProcessFlowController');


    router.get('/fluxo', ProcessFlowController.getIndex);


module.exports = router;