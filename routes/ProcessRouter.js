const express = require("express");
const router = express.Router();
const ProcessController = require('../controllers/ProcessController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/processos', adminAuth, ProcessController.processIndexGet);
router.get('/processos/criar', adminAuth, ProcessController.processCreateGet);
router.post('/processos/criar', adminAuth, ProcessController.processCreatePost);
router.post('/processos/deletar/:id', adminAuth, ProcessController.processDeletePost);
router.get('/processos/editar/:id', adminAuth, ProcessController.processUpdateGet);
router.post('/processos/editar/:id', adminAuth, ProcessController.processUpdatePost);



module.exports = router;