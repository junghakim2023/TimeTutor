const db = require('../../models/index');
const chatSequelize = db.chatSequelize; 

const loginModule = require('../services/login.service');
const replyModule = require('../services/reply.service');

const getPreviouseMessage = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
         res.status(502).send("invalid user");
         return;
    }
    var user = loginModule.getUserData(req);
    const chatList =  chatSequelize.findAll({
            where: { user_index: user.userIdx },
            order: [['createdAt', 'ASC']],
            offset: req.body.offset,
            limit: 20
          }).then(chatList => {
             return res.send(chatList);
          })
          .catch(error => {
            console.log(error);
            return res.status(500).send(error);
          });
}

const teacherSay = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    chatSequelize.createChat("Teacher", user.userIdx, false, req.body.message)
    return res.send('ok');
}

const say = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    var replyMessage=null;
    chatSequelize.createChat(user.userName, user.userIdx, true, req.body.message)
    replyMessage = replyModule.reply(user.userIdx, req.body.message);
    return res.send(replyMessage);
}

module.exports = {getPreviouseMessage, say, teacherSay}