const path = require("path");
var axios = require('axios');

const testPage = function(req, res){
    res.sendFile(path.resolve('res/testPage.html'));
}

const mainPage = function(req, res){
    res.sendFile(path.resolve('res/mainPage.html'));
}

function setCommonData(data){
    data.loginURL = process.env.LOGIN_URL + "/login";
    return data;
}
// path : /init
// initData : login page URL, accessToken, refresh Token
const init = function(req, res){

    var tokenIndex = req.query.tokenIndex;
    if (tokenIndex === undefined || tokenIndex == 'null'){
        // go to login page
        var data = new Object();
        setCommonData(data);
        res.send(data);
        return;
    }

    axios.get(process.env.LOGIN_URL+"/token/get?tokenIndex="+tokenIndex, header)
    .then(response=>{       
        var data = new Object();
        setCommonData(data);
        data.accessToken = response.data.accessToken;
        data.refreshToken = response.data.refreshToken;

        res.send(data);

    }).catch(error => {
        console.error('error : ', error);
    });
}

module.exports = {testPage, mainPage, init}