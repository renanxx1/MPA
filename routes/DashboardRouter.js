const express = require("express");
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/', adminAuth, DashboardController.index);
router.get('/dashboard/:process/:id', adminAuth, DashboardController.dashboardIndex);


module.exports = router;