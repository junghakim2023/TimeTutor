const express = require('express');
const router = express.Router();

const timetutorService = require('../services/timetutor.service');

router.route('/')
.get(timetutorService.mainPage);

router.route('/testPage')
.get(timetutorService.testPage);

router.route('/init')
.get(timetutorService.init);



module.exports = router;