const db = require('../../models/index');
const chatSequelize = db.chatSequelize; 

const loginModule = require('../services/login.service');

const getPreviouseMessage = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    const chatList =  chatSequelize.findAll({
            where: { user_index: user.userIdx },
            order: [['createdAt', 'DESC']],
            offset: req.body.offset,
            limit: 20
          }).then(chatList => {
             return res.send(chatList);
          })
          .catch(error => {
            return res.status(500).send(error);
          });
}

const tutorSay = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    if (req.body.message != null && req.body.message != '')
        chatSequelize.createChat("Tutor", user.userIdx, false, req.body.message)
    return res.send('ok');
}

const say = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    if (req.body.message != null && req.body.message != '')
        chatSequelize.createChat(user.userName, user.userIdx, true, req.body.message)
        
    var replyMessage=null;
    replyMessage = reply(user.userIdx, req.body.message);
    return res.send(replyMessage);
}

const reply = function(userIndex, message){
    var replyMessage = null;

    if (message == 'hello')
        replyMessage = 'hello';

    if (replyMessage == null)
        return null;

    chatSequelize.createChat("Tutor", userIndex, false, replyMessage);

    return replyMessage;
}

module.exports = {getPreviouseMessage, say, tutorSay}