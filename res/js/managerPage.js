var cloneMe;
var cloneTeacher;

cloneMe = $('#sampleYou').clone();
cloneTeacher = $('#sampleTeacher').clone();

$('#sampleYou').remove();
$('#sampleTeacher').remove();
$('#sendButton').click(function() {
    inputText();
});

function addTeacherMessage(message, slow){
    if (message == '' || message ==null)
        return;

    var say = function(){
            var chatFromTeacher = cloneTeacher.clone();
            chatFromTeacher.find("#sampleTeacherText").text(message);
            chatFromTeacher.css("visibility", "visible")
            chatFromTeacher.appendTo("#chattingArea");
            $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
    }

    if (slow){
        setTimeout(() => {  say(); }, 800);
    }else
        say();


}

function addMessage(message){
    var chatFromYou = cloneMe.clone();
    chatFromYou.find("#sampleYouText").text(message);
    
    chatFromYou.css("visibility", "visible")
    chatFromYou.appendTo("#chattingArea");
    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
}

function sendMessage(msg){
    $.ajax({
        url : '/chat/say',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({ message: msg }),
        success : function(message, status, request) {
            addTeacherMessage(message, true);         
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
    
    addMessage($('#chatInput').val());
    sendMessage($('#chatInput').val());
    $('#chatInput').val("");
}


function setPreviousMessage(chatList){
    if (chatList == null || chatList.length <= 0)
        return;       

        for (const chatData of chatList) {
            if (chatData.is_me == true)
                addMessage(chatData.contents);
            else
                addTeacherMessage(chatData.contents);
        };

    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
}

function getPreviousMessage(){
    $.ajax({
        url : '/chat/get/previous/message',
        type : 'GET',
        headers: getHeaderToken(),
        data : {offset : 0},
        success : function(data, status, request) {
            if (data == null || data.length <= 0){
                var welcome = "Welcome to TimeTutor! " + localStorage.getItem("userName");
                addTeacherMessage(welcome, true);
                sendMessageToTeacher(welcome);
            }
            else
                setPreviousMessage(data);
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}

function sendMessageToTeacher(msg){
    $.ajax({
        url : '/chat/say/teacher',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({ message: msg }),
        success : function(message, status, request) {
            //        
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });
}