var cloneMe;
var cloneYou;

cloneMe = $('#sampleYou').clone();
cloneYou = $('#sampleMe').clone();

function addTeacheMessage(msg){
    var chatFromYou = cloneYou.clone();
    chatFromYou.find("#sampleYouText").text(msg);
    chatFromYou.css("visibility", "visible")
    chatFromYou.appendTo("#chattingArea");
}

function sendMessage(msg){
    $.ajax({
        url : '/chat/say',
        type : 'POST',
        contentType: 'application/json',
        data : JSON.stringify({ message: msg }),
        success : function(data, status, request) {
            addTeacheMessage(data.message);         
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}

function inputText(){
    if ($('#chatInput').val() == "" || $('#chatInput').val() == null)
        return;
    var chatFromMe = cloneMe.clone();
    chatFromMe.find("#sampleYouText").text($('#chatInput').val());
    
    chatFromMe.css("visibility", "visible")
    chatFromMe.appendTo("#chattingArea");

    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
    sendMessage($('#chatInput').val());
    $('#chatInput').val("");
    
}
$('#sampleYou').remove();
$('#sampleMe').remove();
$('#sendButton').click(function() {
    inputText();
});

function setPreviousMessage(){
}

function getPreviousMessage(){
    $.ajax({
        url : '/getAllMessage',
        type : 'GET',
        data : {index : 0},
        success : function(data, status, request) {
           setPreviousMessage(data);
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}