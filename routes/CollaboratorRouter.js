const express = require("express");
const router = express.Router();
const CollaboratorController = require('../controllers/CollaboratorController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/colaboradores', adminAuth, CollaboratorController.getIndex);
router.get('/colaboradores/criar', adminAuth, CollaboratorController.getCreate);
router.post('/colaboradores/criar', adminAuth, CollaboratorController.setCreate);
router.post('/colaboradores/deletar/:id', adminAuth, CollaboratorController.setDelete);
router.get('/colaboradores/editar/:id', adminAuth, CollaboratorController.getUpdate);
router.post('/colaboradores/editar/:id', adminAuth, CollaboratorController.setUpdate);



module.exports = router;