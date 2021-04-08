const express = require("express");
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const adminAuth = require("../middlewares/adminAuth");

router.get('/admin', adminAuth, AdminController.adminIndexGet);
router.get('/admin/criar', adminAuth, AdminController.adminCreateGet);
router.post('/admin/criar', adminAuth, AdminController.adminCreatePost);
router.post('/admin/deletar/:id', adminAuth, AdminController.adminDeletePost);
router.get('/admin/editar/:id', adminAuth, AdminController.adminUpdateGet);
router.post('/admin/editar/:id', adminAuth, AdminController.adminUpdatePost);



module.exports = router;