function extraTutorMessage(chatFromTutor, info){
    chatFromTutor.find(".deleteBtn").attr("data", info.idx);
    chatFromTutor.find(".deleteBtn").css("display","block");

    var correct = parseInt(info.correct);
    var bad = parseInt(info.bad);
    var correctRateText = chatFromTutor.find("#correctRate");
    if (correct == 0 && bad == 0){
        correctRateText.html("");
    }
    else{
        let rate = (correct/(correct + bad) * 100).toFixed(2);
        correctRateText.html("Correct : " + rate + "%");
        if (rate <= 0 ) correctRateText.html("");
        else if (rate <= 30) correctRateText.css("color", "red");
        else if (rate <= 70) correctRateText.css("color", "orange");
        else correctRateText.css("color", "green");
    }
}

function addTutorMessage(message, slow, info){
    if (message == '' || message ==null)
        return;

    var say = function(){
            var chatFromTutor = cloneTutor.clone();
            chatFromTutor.find("#sampleTutorText").text(message);
            chatFromTutor.css("visibility", "visible")
            chatFromTutor.appendTo("#chattingArea");
            if (info != null || info != undefined){
                extraTutorMessage(chatFromTutor, info);
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

function addTutorDiff(questionInfo, answer){
    if (questionInfo == '' || questionInfo ==null)
        return;

    if (answer == '' || answer ==null)
        return;

    var say = function(){
         let output = window.htmldiff(answer, questionInfo.answer);
         var chatFromTutor = cloneTutor.clone();
        
         var correct = false;
         if (output.indexOf('<ins>') == -1 && output.indexOf('<del>') == -1){
             let check = "[very good] <br>";
             output = "<good>" + output + "</good>";
             chatFromTutor.find("#sampleTutorText").html(check + output);
             correct = true;
         }else{
             let check = "[check] <br>";
             chatFromTutor.find("#sampleTutorText").html(check + output);
         }
         
         chatFromTutor.css("visibility", "visible")
         chatFromTutor.appendTo("#chattingArea");
         

         sendAnswerResult(questionInfo, correct);

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

function sendTutorMessage(message, info){
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

    addTutorMessage(message, true, info);
}

function sendAnswerResult(info, correct){
    $.ajax({
        url : '/qna/answer/result?questionIdx='+info.idx+"&correct="+correct,
        type : 'GET',
        contentType: 'application/json',
        headers: getHeaderToken(),
        success : function(message, status, request) {
            //        
      },
        error:function(request, textStatus, error){
            pringError(request, textStatus, error)
        }
        });
}


