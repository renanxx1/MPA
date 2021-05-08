const express = require("express");
const router = express.Router();
const ActivityController = require('../controllers/ActivityController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/atividades', adminAuth, ActivityController.getIndex);
router.get('/atividades/criar', adminAuth, ActivityController.getCreate);
router.post('/atividades/criar', adminAuth, ActivityController.setCreate);
router.post('/atividades/deletar/:id', adminAuth, ActivityController.setDelete);
router.get('/atividades/editar/:id', adminAuth, ActivityController.getUpdate);
router.post('/atividades/editar/:id', adminAuth, ActivityController.setUpdate);

module.exports = router;