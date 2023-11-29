
function addTutorMessage(message, slow, sendToDB){
    if (message == '' || message ==null)
        return;

    var say = function(){
            var chatFromTutor = cloneTutor.clone();
            chatFromTutor.find("#sampleTutorText").text(message);
            chatFromTutor.css("visibility", "visible")
            chatFromTutor.appendTo("#chattingArea");
            $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
    }

    if (slow){
        setTimeout(() => {  say(); }, 800);
    }else
        say();

    
    if (sendToDB)
        sendTutorMessage(message);


}

function addMyMessage(message){
    var chatFromYou = cloneMe.clone();
    chatFromYou.find("#sampleYouText").text(message);
    
    chatFromYou.css("visibility", "visible")
    chatFromYou.appendTo("#chattingArea");
    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
}

function senMyMessage(msg){
    $.ajax({
        url : '/chat/say',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({ message: msg }),
        success : function(message, status, request) {
            addTutorMessage(message, true);         
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))

            alert("You need to log in to use the service");
            window.location.href="/";
        }
        });
}

function sendTutorMessage(msg){
    $.ajax({
        url : '/chat/say/tutor',
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

        addTutorMessage(msg, true);
}
