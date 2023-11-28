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

        chatList = chatList.reverse();
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
                var welcome = "Welcome to TimeTutor! " + localStorage.getItem("userName") + "! \n";
                
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

        addTeacherMessage(msg, true);
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
    changeTo("qna");
}

function rescheduleBtnClick(){
    changeTo("reschedule");
}

function guildBtnClick(){
    var message = 'Hello, I am TimeTutor. When you create a questionnaire, I will randomly select questions from the questionnaire at set times and ask you.';
    sendMessageToTeacher(message);
    message = '1. Click the “Make QnA” button to register a question.';
    sendMessageToTeacher(message);
    message = '2. Click the “ReScheduleing Alarm” button to be notified of the time you need to ask your question.';
    sendMessageToTeacher(message);
    message = '3. If you need this explanation again, click the “Guide” button!';
    sendMessageToTeacher(message);
    message = '4. Of course, if necessary, you can click the “QnA” button right away to start Q&A!';
    sendMessageToTeacher(message);
}