const express = require("express");
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/', adminAuth, DashboardController.getIndex);
router.get('/dashboard/:process/:id', adminAuth, DashboardController.getDashboardIndex);


module.exports = router;