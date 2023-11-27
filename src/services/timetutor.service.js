const path = require("path");


const testPage = function(req, res){
    res.sendFile(path.resolve('res/testPage.html'));
}

const mainPage = function(req, res){
    res.sendFile(path.resolve('res/mainPage.html'));
}

const schedularPage = function(req, res){
    res.sendFile(path.resolve('res/schedularPage.html'));
}

const managerPage = function(req, res){
    res.sendFile(path.resolve('res/managerPage.html'));
}

function setCommonData(data){
    data.loginURL = process.env.LOGIN_URL + "/login";
    return data;
}

const init = function(req, res){
    var data = new Object();
    setCommonData(data);
    res.send(data);
}


module.exports = {testPage, mainPage, managerPage, schedularPage, init}