const express = require("express");
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/atividades', adminAuth, ActivityController.activityIndexGet);
router.get('/atividades/criar', adminAuth, ActivityController.activityCreateGet);
router.post('/atividades/criar', adminAuth, ActivityController.activityCreatePost);
router.post('/atividades/deletar/:id', adminAuth, ActivityController.activityDeletePost);
router.get('/atividades/editar/:id', adminAuth, ActivityController.activityUpdateGet);
router.post('/atividades/editar/:id', adminAuth, ActivityController.activityUpdatePost);

module.exports = router;