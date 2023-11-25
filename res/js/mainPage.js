
function checkLogin(){

    var accessToken = localStorage.getItem('accessToken');
    var refreshToken = localStorage.getItem('refreshToken');
    $.ajax({
        'url' : '/checkLogin',
        'type' : 'GET',
        'headers': {'Authorization':  accessToken, 'Authorization-Refresh' :  refreshToken},
        'success' : function(data, status, request) {
            console.log(data);
        },
        'error':function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

function init(data){
    $('#loginBtn').click(function() {window.location.href = data.loginURL + "?redirection="+window.location.href;});
    setToken(data);

    $('.comming-soon').click(function() {alert("Comming soon!")});
}
function setToken(data){
    if (data.accessToken != 'null' && data.accessToken != undefined)
        localStorage.setItem('accessToken', data.accessToken);
    if (data.refreshToken != 'null'&& data.refreshToken != undefined)
        localStorage.setItem('refreshToken', data.refreshToken);
}
function initPage() {
    const tokenIndex = getQueryParam('tokenIndex');
    $.ajax({
        url : '/init',
        type : 'GET',
        data : {
            tokenIndex : tokenIndex
        },
        success : function(data, status, request) {
            init(data);      
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}       