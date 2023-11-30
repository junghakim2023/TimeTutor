const express = require('express');
const router = express.Router();

const qnaService = require('../services/qna.service');

router.route('/set/alarmTime')
.post(qnaService.setAlarmTime);

router.route('/set/qna')
.post(qnaService.setQnA);

router.route('/get/question')
.post(qnaService.getQuestion);


router.route('/delete/question')
.get(qnaService.deleteQnA);

router.route('/set/answer')
.post(qnaService.setAnswer)

router.route('/get/alarmTime')
.get(qnaService.getAlarmTime)

module.exports = router;