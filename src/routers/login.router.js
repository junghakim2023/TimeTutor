const express = require('express');
const router = express.Router();

const loginService = require('../services/login.service');

router.route('/checkLogin')
.get(loginService.checkLogin);

router.route('/getTokenInfo')
.get(loginService.getTokenInfo);

module.exports = router;