const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/IsAuth.middleware');
const MongoDB = require('../helpers/mongoDB');

const router = express.Router();


// GET admin/mongo/automation
router.get('/mongo/automation', MongoDB.insertData); 

module.exports = router;