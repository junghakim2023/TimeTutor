const db = require('../../models/index');
const chatSequelize = db.chatSequelize; 

const reply = function(userIndex, message){
    var replyMessage = null;

    if (message == 'hello')
        replyMessage = 'hello';

    if (replyMessage == null)
        return null;

    chatSequelize.createChat("Teacher", userIndex, false, replyMessage);

    return replyMessage;
}

module.exports = {reply}