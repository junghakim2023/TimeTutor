function getHeaderToken(){
    var accessToken = localStorage.getItem('accessToken');
    accessToken = accessToken.replace("Bearer ", "");
    
    var refreshToken = localStorage.getItem('refreshToken');
    refreshToken = refreshToken.replace("Bearer ", "");
    var tokens = {'Authorization':  accessToken, 'Authorization-Refresh' :  refreshToken};
    return tokens;
}
