
function addTutorMessage(message, slow, questionNum){
    if (message == '' || message ==null)
        return;

    var say = function(){
            var chatFromTutor = cloneTutor.clone();
            chatFromTutor.find("#sampleTutorText").text(message);
            chatFromTutor.css("visibility", "visible")
            chatFromTutor.appendTo("#chattingArea");
            if (questionNum != undefined){
                chatFromTutor.find(".deleteBtn").attr("data", questionNum);
                chatFromTutor.find(".deleteBtn").css("display","block");
            }
            $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
    }

    if (slow){
        setTimeout(() => {
              say(); 
                     
        }, 800);
    }else{
        say();
    }
}

function addMyMessage(message){
    var chatFromYou = cloneMe.clone();
    chatFromYou.find("#sampleYouText").text(message);
    
    chatFromYou.css("visibility", "visible")
    chatFromYou.appendTo("#chattingArea");
    $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
}

function sendMyMessage(msg){
    $.ajax({
        url : '/chat/say',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({ message: msg }),
        success : function(message, status, request) {
            addMyMessage(msg, true);         
      },
        error:function(request, textStatus, error){
            pringError(request, textStatus, error);
            alert("You need to log in to use the service");
            window.location.href="/";
        }
        });
}

function sendTutorMessage(message, questionNum){
    $.ajax({
        url : '/chat/say/tutor',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({ message }),
        success : function(message, status, request) {
            //        
      },
        error:function(request, textStatus, error){
            console.log(JSON.stringify(request))
            console.log(JSON.stringify(textStatus))
            console.log(JSON.stringify(error))
        }
        });

    addTutorMessage(message, true, questionNum);
}
