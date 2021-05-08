const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin', adminAuth, AdminController.getIndex);
router.get('/admin/criar', adminAuth, AdminController.getCreate);
router.post('/admin/criar', adminAuth, AdminController.setCreate);
router.post('/admin/deletar/:id', adminAuth, AdminController.setDelete);
router.get('/admin/editar/:id', adminAuth, AdminController.getUpdate);
router.post('/admin/editar/:id', adminAuth, AdminController.setUpdate);



module.exports = router;