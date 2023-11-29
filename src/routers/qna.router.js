const express = require('express');
const router = express.Router();

const qnaService = require('../services/qna.service');

router.route('/set/alarmTime')
.post(qnaService.setAlarmTime);

router.route('/set/qna')
.post(qnaService.setQnA);

router.route('/get/question')
.post(qnaService.getQuestion);

router.route('/qna/set/answer')
.post(qnaService.setAnswer)

module.exports = router;