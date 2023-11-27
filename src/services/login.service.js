var axios = require('axios');
const jwt = require('jsonwebtoken');

const tokenStatus = {
    VALID : "VALID",
    INVALID_TOKEN : "INVALID_TOKEN",
    EXPIRED : "EXPIRED"
}

const checkLogin = function(req, res){
    var accessToken = req.headers['authorization']; 
    var refreshToken = req.headers['authorization-refresh']; 

    var valid = tokenStatus.INVALID_TOKEN;
    if (accessToken != 'null' && refreshToken != 'null' 
    && accessToken != undefined && refreshToken != undefined){

        var accessValid = resolveJwtToken(accessToken);
        if (accessValid == tokenStatus.EXPIRED)
            valid = tokenStatus.EXPIRED;
        else{
            var refreshValid = resolveJwtToken(refreshToken);
            if (accessValid && refreshValid)
                valid = tokenStatus.VALID; 
        }
    }
    res.send(valid);
    return ;
}

function resolveJwtToken(token){
    const secretKey = process.env.JWT_SECRET_KEY;
    var valid = tokenStatus.INVLID_TOKEN;

    jwt.verify(token, secretKey, { algorithms: ['HS256'],encoding: 'base64' }, (err, decoded) => {
    if (err) {
        console.error('JWT verification failed:', err);        
        if (err.toString().indexOf('Expired') != -1)
            valid =  tokenStatus.EXPIRED;
    }else
        valid = tokenStatus.VALID;    
    });

    return valid;
    
  }

  function getResolvedJwtTokenData(token){
    const secretKey = process.env.JWT_SECRET_KEY;
    var valid = false;
    var result = null;
    jwt.verify(token, secretKey, { algorithms: ['HS256'],encoding: 'base64' }, (err, decoded) => {
    if (err) {        
        console.error('JWT verification failed:', err);
        valid =  false;
        } else {
            result =  decoded;
        }
    });

    return result;
    
  }

  const getTokenInfo = function (req, res){
    var tokenKey = req.query.tokenKey;
    if (tokenKey === undefined || tokenKey == 'null')
        return;

    axios.get(process.env.LOGIN_URL+"/login/token/get?tokenKey="+tokenKey)
    .then(response=>{       
        var data = new Object();      
        accessToken = response.data.accessToken
        refreshToken = response.data.refreshToken
        console.log(accessToken);
        var accessValid = resolveJwtToken(accessToken);
        var refreshValid = resolveJwtToken(refreshToken);

        if ( accessValid == tokenStatus.EXPIRED)
            res.status(501).send("expired access token");

        if (refreshValid != tokenStatus.VALID)
            res.status(500).send("invalid token");

        if (accessValid != tokenStatus.VALID)
            res.status(500).send("invalid token");

        data.accessToken = accessToken;
        data.refreshToken = refreshToken;
        data.userName = getResolvedJwtTokenData(accessToken).userName;
        res.send(data);

    }).catch(error => {
        res.status(500).send(error);
    });
  }

  module.exports = {checkLogin, getTokenInfo}