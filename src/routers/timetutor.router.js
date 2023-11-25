const express = require('express');
const router = express.Router();

const timetutorService = require('../services/timetutor.service');

router.route('/')
.get(timetutorService.mainPage);

router.route('/testPage')
.get(timetutorService.testPage);

router.route('/init')
.get(timetutorService.init);

router.route('/checkLogin')
.get(timetutorService.checkLogin);

router.route('/manager')
.get(timetutorService.managerPage);

router.route('/schedular')
.get(timetutorService.schedularPage);

module.exports = router;