// Global value
var qTopic_arr = []; // contain decoded data from websocket server
var json_str =[]; // Question list Array, will fill with decoded json data
var cur_question = 0; // Current question ID
var answerRecord = [];
var actionStatus = 0;
var hpW; // Health Bar, so far....
var hintTrigger5s, hintTrigger10s; //Hint container

define(function (require) {
//define(function (require) {
    // Require Files
    var process = require('./process');
    var animation = require('./animation');
    var sound = require('./sound');
    var websocket = require('./websocket');


    // Init Websocket connection    
    var wsLocation="ws://119.81.20.72:27575";    
    var ws=websocket.openWsConnect(wsLocation);
    ws.onmessage = function(evt) {         
        //console.log("Message : " + evt.data);
        // JSON structure
        // "JSON.event"|"JSON.msg"
        qTopic_arr = JSON.parse(evt.data)
        switch(qTopic_arr.event){
            case 'openTrue':
                console.log(qTopic_arr.msg);
                ws.send(JSON.stringify({"event":"getQ"}));
                break;
            case 'getQ':
                json_str = JSON.parse(qTopic_arr.msg);
                process.createQuestion();
                break;
            default:
                console.log('No Data');
                break;
        }
    }
    

    // Init game
    $(document).ready(function() {
        // Init Animation Asset
        animation.init();
        
        // Init sound Asset
        sound.loadSound();
    });
    
    //  Listener area
    $(document).keyup(function(e) {  // Detect keyup and play event
           sound.playSound();
           animation.jumpStart();
    });
    
    $(document).on('input','#gameInput',function() { // Update keyboard input to check function
            var curTxt = $('#gameInput').val();
            if(process.checkQuestion(curTxt)){
                sound.coinSound();
                animation.fxblink();

                clearTimeout(hintTrigger5s);
                clearTimeout(hintTrigger10s);

                if(cur_question==json_str.length){
                    process.clearAll();
                }else{
                    $('#gameTxt').text('Wooooot! Correct!! : )');
                    setTimeout(function(){process.createQuestion();},1000); // 2 sec before next question
                }
            }
    });

    $(document).on('click','#growsound',function() {
        sound.growSound();
    });

    // This button is inside result.html
    $(document).on('click','#playAgain',function() {
        process.restart();
    });
});