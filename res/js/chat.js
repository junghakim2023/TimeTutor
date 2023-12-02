
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

function addTutorDiff(originalAnswer, answer){
    if (originalAnswer == '' || originalAnswer ==null)
        return;

    if (answer == '' || answer ==null)
        return;

    var say = function(){
         let output = window.htmldiff(originalAnswer, answer);
         var chatFromTutor = cloneTutor.clone();
        
         
         if (output.indexOf('<ins>') == -1 && output.indexOf('<del>') == -1){
             let check = "[very good] <br>";
             output = "<good>" + output + "</good>";
             chatFromTutor.find("#sampleTutorText").html(check + output);
         }else{
             let check = "[check] <br>";
             chatFromTutor.find("#sampleTutorText").html(check + output);
         }
         
         chatFromTutor.css("visibility", "visible")
         chatFromTutor.appendTo("#chattingArea");

         $(".chat-messages").scrollTop($(".chat-messages")[0].scrollHeight);
    }

    setTimeout(() => {say();  }, 800);
    
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
            pringError(request, textStatus, error)
        }
        });

    addTutorMessage(message, true, questionNum);
}
