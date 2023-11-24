const path = require("path");

const testPage = function(req, res){
    res.sendFile(path.resolve('res/testPage.html'));
}

const mainPage = function(req, res){
    res.sendFile(path.resolve('res/mainPage.html'));
}
const init = function(req, res){
    res.send('init');
}

module.exports = {testPage, mainPage, init}