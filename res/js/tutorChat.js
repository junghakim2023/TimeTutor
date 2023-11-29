var cloneMe;
var cloneTutor;
var questionNumber;
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
        case "menu":
            menuAreaShow =  "block";
            break;
    }

    $("#buttonMenueArea").css("display", menuAreaShow);
    $("#qnaArea").css("display", qnaAreaShow);
    $("#qnaMakingArea").css("display", qnaMakerAreaShow);
    $("#rescheduleArea").css("display", rescheduleAreaShow);

}

function qnaMakingBtnClick (){
    changeTo("qnaMaking");
}


function qnaBtnClick(){
    requestQuestion();
    
}

function rescheduleBtnClick(){
    changeTo("reschedule");
}

function guildBtnClick(){
    var message = 'Hello, I am TimeTutor. When you create a questionnaire, I will randomly select questions from the questionnaire at set times and ask you.';
    sendTutorMessage(message);
    message = '1. Click the “Make QnA” button to register a question.';
    sendTutorMessage(message);
    message = '2. Click the “ReScheduleing Alarm” button to be notified of the time you need to ask your question.';
    sendTutorMessage(message);
    message = '3. If you need this explanation again, click the “Guide” button!';
    sendTutorMessage(message);
    message = '4. Of course, if necessary, you can click the “QnA” button right away to start Q&A!';
    sendTutorMessage(message);
}

function sayToGuest(){
    var message = 'Hello, I am TimeTutor. You need to log in to use the service. ';
    addTutorMessage(message, true, true);
}

function sendAnswer(){
    if (questionNumber == undefined){
        var message = "Wait until Question to be prepared";
        addTutorMessage(message, true, true);
    }

    var answer = $('#chatInput').val();
    if (answer == "" || answer == null){
        var message = "Enter your answer";
        addTutorMessage(message, true, true);
        return;
    }
    $.ajax({
        url : '/qna/set/answer',
        type : 'POST',
        data: answer,
        headers: getHeaderToken(),
        data : {offset : 0},
        success : function(data, status, request) {
            addTutorMessage(data.message, true, true);
            changeTo("menu");
      },
        error:function(request, textStatus, error){
            printError(request, textStatus, error)
        }
        });
}

function requestQuestion(){
    $.ajax({
        url : '/qna/get/question',
        type : 'POST',
        headers: getHeaderToken(),
        success : function(data, status, request) {
            questionNumber = data.questionNumber;

            addTutorMessage(data.question, true, true);
            changeTo("qna");
      },
        error:function(request, textStatus, error){
            printError(request, textStatus, error)

            var message = "There is no availiable Question. Make question first!"
            addTutorMessage(message, true, true);
        }
        });
}

function sendQnA(){
    var questionInput = $('#questionInput').val();
    if (questionInput == "" || questionInput == null){
        var message = "Enter your question";
        addTutorMessage(message, true, true);
        return;
    }

    var answerInput = $('#answerInput').val();
    if (answerInput == "" || answerInput == null){
        var message = "Enter your answer";
        addTutorMessage(message, true, true);
        return;
    }
    
    $.ajax({
        url : '/qna/set/qna',
        type : 'POST',
        headers: getHeaderToken(),
        data : {questionInput,answerInput},
        success : function(data, status, request) {
            var message = "I get your question and answer successfully!"
            addTutorMessage(message, true, true);
            changeTo("menu");
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });
}

function sendTimeSet(){
    var times = $('.timeText');

    $.ajax({
        url : '/qna/set/alarmTime',
        type : 'POST',
        data: times,
        headers: getHeaderToken(),
        success : function(data, status, request) {
            var message = "I set your schedules successfully!"
            addTutorMessage(message, true, true);
            changeTo("menu");
      },
      error:function(request, textStatus, error){
        printError(request, textStatus, error)
    }
    });
}