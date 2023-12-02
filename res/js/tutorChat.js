var cloneMe;
var cloneTutor;
var originalAnswer;
cloneMe = $('#sampleYou').clone();
cloneTutor = $('#sampleTutor').clone();

$('#sampleYou').remove();
$('#sampleTutor').remove();
$('#sendButton').click(function() {
    inputText();
});

function inputText(){
    if (!checkAuthToken()){
        sayToGuest();
        return;
    }
    
    if ($('#chatInput').val() == "" || $('#chatInput').val() == null)
        return;
    
    addMyMessage($('#chatInput').val());
    sendMyMessage($('#chatInput').val());
    $('#chatInput').val("");
}


function setPreviousMessage(chatList){
    if (chatList == null || chatList.length <= 0)
        return;       

        chatList = chatList.reverse();
        for (const chatData of chatList) {
            if (chatData.is_me == true)
                addMyMessage(chatData.contents);
            else
                addTutorMessage(chatData.contents);
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
                var welcome = "Welcome to TimeTutor! " + localStorage.getItem("userName") + "! \n";
                sendTutorMessage(welcome);
            }
            else
                setPreviousMessage(data);
      },
        error:function(request, textStatus, error){
            sayToGuest();
            printError(request, textStatus, error)
        }
        });
}

function changeTo(area){
    var qnaAreaShow = "none";
    var menuAreaShow = "none";
    var qnaMakerAreaShow = "none";
    var rescheduleAreaShow = "none";

    switch(area){
        case "qna":
            qnaAreaShow = "block";
            break;
        case "qnaMaking":
            qnaMakerAreaShow =  "block";
            break;
        case "reschedule":
            rescheduleAreaShow =  "block";
            break;
        case "menu":{
            menuAreaShow =  "block";
            $("#chattingArea").css("height", "92%");
            break;
        }
    }

    $("#buttonMenueArea").css("display", menuAreaShow);
    $("#qnaArea").css("display", qnaAreaShow);
    $("#qnaMakingArea").css("display", qnaMakerAreaShow);
    $("#rescheduleArea").css("display", rescheduleAreaShow);

}

function qnaMakingBtnClick (){
    if (!checkAuthToken()){
        sayToGuest();
        return;
    }
    changeTo("qnaMaking");

    $("#chattingArea").css("height", "80%");
}


function qnaBtnClick(){
    if (!checkAuthToken()){
        sayToGuest();
        return;
    }
    sendMyMessage("Give me question!");
    requestQuestion();
    
}

function rescheduleBtnClick(){
    if (!checkAuthToken()){
        sayToGuest();
        return;
    }
    getTimeSet();
    changeTo("reschedule");
}

async function guideBtnClick(){
    var message = 'Hello, I am TimeTutor. When you create a questionnaire, I will randomly select questions from the questionnaire at set times and ask you.';
    addTutorMessage(message, true);
    await sleep(1200);

    message = '1. Click the “Make QnA” button to register a question.';
    addTutorMessage(message, true);
    await sleep(1200);
    
    message = '2. Click the “ReScheduleing Alarm” button to be notified of the time you need to ask your question.';
    addTutorMessage(message, true);
    await sleep(1200);
    
    message = '3. If you need this explanation again, click the “Guide” button!';
    addTutorMessage(message, true);
    await sleep(1200);
    
    message = '4. Of course, if necessary, you can click the “QnA” button right away to start Q&A!';
    addTutorMessage(message, true);
}

function sayToGuest(){
    var message = 'Hello, I am TimeTutor. You need to log in to use the service. ';
    addTutorMessage(message, true);
}

function sendAnswer(){
    if (originalAnswer == '' || originalAnswer == null || originalAnswer == undefined){
        var message = "Wait until Question to be prepared";
        addTutorMessage(message, true);
        return;
    }

    var answer = $('#chatInput').val();
    if (answer == "" || answer == null){
        var message = "Enter your answer";
        addTutorMessage(message, true);
        return;
    }

    
    sendMyMessage("A : " + answer);

    addTutorDiff(originalAnswer, answer);
    //addTutorMessage("Your Answer : " + answer, true);

    $('#chatInput').val('')
    originalAnswer = null;
    changeTo("menu");
}

function requestQuestion(){
    $.ajax({
        url : '/qna/get/question',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        success : function(data, status, request) {
            if (data == null || data == ''){
                var message = "There is no availiable Question. Make question first!"
                sendTutorMessage(message, true, true);
                return;
            }

            originalAnswer = data.answer;
            sendTutorMessage("Q : " + data.question, data.idx);
            changeTo("qna");
      },
        error:function(request, textStatus, error){
            printError(request, textStatus, error)

            var message = "There is no availiable Question. Make question first!"
            sendTutorMessage(message);
        }
        });
}

function sendQnA(){
    var questionInput = $('#questionInput').val();
    if (questionInput == "" || questionInput == null){
        var message = "Enter your question";
        sendTutorMessage(message);
        return;
    }

    var answerInput = $('#answerInput').val();
    if (answerInput == "" || answerInput == null){
        var message = "Enter your answer";
        sendTutorMessage(message);
        return;
    }
    
    sendMyMessage("Q : " + questionInput + " \n" + "A : " + answerInput);

    $.ajax({
        url : '/qna/set/qna',
        type : 'POST',
        contentType: 'application/json',
        headers: getHeaderToken(),
        data : JSON.stringify({questionInput,answerInput}),
        success : function(data, status, request) {
            var message = "I get your question and answer successfully!"
            sendTutorMessage(message);
            changeTo("menu");
            $('#questionInput').val('')
            $('#answerInput').val('')
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });
}

function sendTimeSet(){
    var times = []
    $('.timeText').each(function(index,item){
        times.push($(this).val());
        
      });

    $.ajax({
        url : '/qna/set/alarmTime',
        type : 'POST',
        contentType: 'application/json',
        data: JSON.stringify(times),
        headers: getHeaderToken(),
        success : function(data, status, request) {
            var message = "I set your schedules successfully! I will send an alarm email according to this schedule. "
            sendTutorMessage(message);
            changeTo("menu");
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });
}

function deleteQnA(button){
    $.ajax({
        url : '/qna/delete/question?questionIdx=' + button.getAttribute("data"),
        type : 'GET',
        headers: getHeaderToken(),
        success : function(data, status, request) {
            var message = "I delete your QnA successfully! "
            sendTutorMessage(message);
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });

    changeTo("menu");
}

function getTimeSet(){
  
    $.ajax({
        url : '/qna/get/alarmTime',
        type : 'GET',
        headers: getHeaderToken(),
        success : function(data, status, request) {
            $('.timeText').each(function(index,item){
                $(this).val('');
              });
            var idx = 0;
            $('.timeText').each(function(index,item){  
                if (data.length > idx) 
                    $(this).val(data[idx].time);
                idx++;
            });
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });
}