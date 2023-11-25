const path = require("path");
var axios = require('axios');
const jwt = require('jsonwebtoken');

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

    axios.get(process.env.LOGIN_URL+"/token/get?tokenIndex="+tokenIndex)
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

const checkLogin = function(req, res){
    var accessToken = req.headers['authorization']; 
    var refreshToken = req.headers['authorization-refresh']; 

    var valid = false;
    if (accessToken != 'null' && refreshToken != 'null' 
    && accessToken != undefined && refreshToken != undefined){
        var accessValid = resolveJwtToken(accessToken);
        var refreshValid = resolveJwtToken(refreshToken);
        if (accessValid && refreshValid)
            valid = true; 
                  
    }
    res.send(valid);
    return ;
}

function resolveJwtToken(token){
    const secretKey = process.env.JWT_SECRET_KEY;
    token = token.substr(7); // substring 'Bearer ' 
    var valid = false;
    jwt.verify(token, secretKey, { algorithms: ['HS256'],encoding: 'base64' }, (err, decoded) => {
    if (err) {
        console.error('JWT verification failed:', err);
        valid =  false;
        } else {
        console.log('JWT verified successfully');
        console.log('Decoded token payload:', decoded);

        valid = true;
        }
    });

    return valid;
    
  }

module.exports = {testPage, mainPage, managerPage, schedularPage, init, checkLogin}