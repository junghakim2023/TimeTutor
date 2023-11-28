const express = require('express');
const router = express.Router();

const chatService = require('../services/chat.service');

router.route('/get/previous/message')
.get(chatService.getPreviouseMessage);

router.route('/say')
.post(chatService.say);

module.exports = router;