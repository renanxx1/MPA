const express = require("express");
const router = express.Router();
const ProcessController = require('../controllers/ProcessController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/processos', adminAuth, ProcessController.getIndex);
router.get('/processos/criar', adminAuth, ProcessController.getCreate);
router.post('/processos/criar', adminAuth, ProcessController.setCreate);
router.post('/processos/deletar/:id', adminAuth, ProcessController.setDelete);
router.get('/processos/editar/:id', adminAuth, ProcessController.getUpdate);
router.post('/processos/editar/:id', adminAuth, ProcessController.setUpdate);



module.exports = router;