const db = require('../../models/index');
const qnaSequelize = db.qnaSequelize; 
const alarmSequelize = db.alarmSequelize; 

const loginModule = require('../services/login.service');

var setAlarmTime = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    alarmSequelize.destroy({
        where: { user_index: user.userIdx }
    }).then(res => {
        for (num in req.body){
            if (req.body[num] != '' && req.body[num] != null)
                alarmSequelize.createAlarm(user.userIdx, req.body[num]);
        }
     })
     .catch(error => {
        console.log(error);
     });

    return res.send("OK");
}

var getAlarmTime = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);

    alarmSequelize.findAll({
        where: { user_index: user.userIdx },
        order: [['createdAt', 'DESC']]
      }).then(qnaList => {
        return res.send(qnaList);
      })
}


var getQuestion = function(req, res){

    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);

    const qnaList =  qnaSequelize.findAll({
        where: { user_index: user.userIdx },
        order: [['createdAt', 'DESC']]
      }).then(qnaList => {
        var length = qnaList.length;
        if (length <= 0)
            return res.send(null);
        const randomNumber = Math.floor(Math.random() * length);
        return res.send(qnaList[randomNumber]);
      })
      .catch(error => {
        return res.status(500).send(error);
      });
}
var setAnswerResult = function(req, res){    
    var questionIdx = req.query.questionIdx;
    var correct = req.query.correct;
    
    console.log(correct);
    console.log(correct == 'true');
    if (correct == 'true')
        qnaSequelize.increaseCorrect(questionIdx);
    else
        qnaSequelize.increaseBad(questionIdx);

    return res.send("OK");
}

var setQnA = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }
    var user = loginModule.getUserData(req);
    var question = req.body.questionInput;
    var answer = req.body.answerInput;
    qnaSequelize.createQna(user.userIdx, question, answer);
    return res.send("OK");
}

var deleteQnA = function(req, res){
    if (loginModule.tokenStatus['VALID'] != loginModule.checkLogin(req, res)){
        return res.status(502).send("invalid user");
    }

    if (req.query.questionIdx != undefined){
        qnaSequelize.destroy({
        where: { idx: req.query.questionIdx }
        });
}
    return res.send("OK");
}
  

module.exports = {setAlarmTime, getQuestion, setAnswerResult, setQnA, getAlarmTime, deleteQnA}