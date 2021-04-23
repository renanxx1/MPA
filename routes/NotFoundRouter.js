const express = require("express");
const router = express.Router();
const adminAuth = require("../middlewares/adminAuth");

router.get('*', adminAuth, function(req, res){
    res.status(404).render('notfound/index')
  });

  module.exports = router;