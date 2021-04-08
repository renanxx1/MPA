const express = require("express");
const router = express.Router();
const CollaboratorController = require('../controllers/CollaboratorController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/colaboradores', adminAuth, CollaboratorController.collaboratorIndexGet);
router.get('/colaboradores/criar', adminAuth, CollaboratorController.collaboratorCreateGet);
router.post('/colaboradores/criar', adminAuth, CollaboratorController.collaboratorCreatePost);
router.post('/colaboradores/deletar/:id', adminAuth, CollaboratorController.collaboratorDeletePost);
router.get('/colaboradores/editar/:id', adminAuth, CollaboratorController.collaboratorUpdateGet);
router.post('/colaboradores/editar/:id', adminAuth, CollaboratorController.collaboratorUpdatePost);



module.exports = router;