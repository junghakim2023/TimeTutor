var loginServerURL;
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function logout(){
    localStorage.setItem('accessToken', null);
    localStorage.setItem('refreshToken', null);
    localStorage.setItem('userName', null);
    setLoginStatus(false);
    window.location.href="/";
}
function init(data){
    loginServerURL = data.loginURL;
    $('#loginBtn').click(function() {window.location.href = loginServerURL + "?redirection="+window.location.href;});
    $('.comming-soon').click(function() {alert("Comming soon!")});
}


function initPage() {
    $.ajax({
        url : '/init',
        type : 'GET',
        success : function(data, status, request) {
            init(data);         
      },
        error:function(request, textStatus, error){
            pringError(request, textStatus, error)
        }
        });
}       

function renewAccessToken(){
    var refresh = localStorage.getItem('refreshToken');
    refresh = refresh.substr(7);
    $.ajax({
        'url' : loginServerURL+"/token/refresh/accessToken",
        'type' : 'POST',
        'header': {
            'Access-Control-Allow-Origin': "*"
          },
        'data' : {refresh},
        'success' : function(data, status, request) {
            setToken(data);
            setLoginStatus(true);
        },
        'error':function(request, textStatus, error){
            pringError(request, textStatus, error)
            logout();
            setLoginStatus(false);
        }
        });
}

function checkLogin(){
    var valid = false;
    $.ajax({
        'url' : '/checkLogin',
        'type' : 'GET',
        'headers': getHeaderToken(),
        'success' : function(data, status, request) {
            if (data == 'VALID') valid = true;
            else if(data == 'EXPIRED')
                renewAccessToken();      
            
            setLoginStatus(valid);
        },
        'error':function(request, textStatus, error){
            pringError(request, textStatus, error)

            setLoginStatus(valid);
        }
        });

        return valid;
}

function setLoginStatus(isLoggedIn){
    if (isLoggedIn){
        $('#loginBtn').css("display", "none");
        $('#logoutBtn').css("display", "block");
        $('#welcomeText').css("display", "block");
        $('#welcomeText').text("Welcome "+ localStorage.getItem('userName') +"!");
    }
    else{
        $('#loginBtn').css("display", "block");
        $('#logoutBtn').css("display", "none");
        $('#welcomeText').css("display", "none");
    }
}

function checkLocalStorageToken(){
    checkLogin();
}

function setToken(data){
    if (data.accessToken != 'null' && data.accessToken != undefined)
        localStorage.setItem('accessToken', "Bearer " + data.accessToken);
    if (data.refreshToken != 'null'&& data.refreshToken != undefined)
        localStorage.setItem('refreshToken', "Bearer " + data.refreshToken);
    if (data.userName != 'null' && data.userName != undefined){
        localStorage.setItem('userName', data.userName);
        window.location.href = "/";
    }
}

function setTokenInfo(tokenKey){
    $.ajax({
        url : '/getTokenInfo',
        type : 'GET',
        data : {
            tokenKey : tokenKey
        },
        success : function(data, status, request) {        
            setToken(data);
            setLoginStatus(true);
      },
        error:function(request, textStatus, error){
            if (request.code == 501)
                renewAccessToken()
            else{
                pringError(request, textStatus, error)
                setLoginStatus(false);
            }
        }
        });
}

function checkMainPageLogin(){
    const tokenKey = getQueryParam('tokenKey');
    if (tokenKey != null || tokenKey != undefined)
        setTokenInfo(tokenKey)
    else{
        if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken"))
            checkLocalStorageToken();
    }
}