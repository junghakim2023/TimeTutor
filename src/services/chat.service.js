const db = require('../../models/index');
const chatSequelize = db.chatSequelize; 


const getPreviouseMessage = function(req, res){

}

const say = function(req, res){
    const chat={
        sender_name : 'jhakim',
        user_index :1,
        is_me: true,
        contents : req.body.message
    }
    chatSequelize.create(chat);
}

module.exports = {getPreviouseMessage, say}