define(function (require) {
    var pControl = require('./p_control');
    var rControl = require('./result_control');
    var animation = require('./animation');
    return {
        checkQuestion: function (curTxt) {
            // Check if the word is correct, if yes proceed to next word.
            //var json_str = JSON.parse(qTopic_arr.msg);
            var cur_word = json_str[cur_question].word;

            curTxt = curTxt.toLowerCase();
            cur_word = cur_word.toLowerCase();
            console.log('curTxt : '+curTxt+' cur_word : '+cur_word);
            
            if(curTxt == cur_word){
                console.log('Correct!');

                // Success behavior
                pControl.successBehavior();

                // Put answer record into an array
                answerRecord[cur_question] = {};
                answerRecord[cur_question].id = json_str[cur_question].qid;
                answerRecord[cur_question].word = json_str[cur_question].word;
                // Next question
                cur_question = cur_question+1;
                return true;
            }else{
                return false;
            }            
        },

        createQuestion: function (){
            // Decode the json string and get Chinese definition
            var cur_word = json_str[cur_question].word;
            var c_def = json_str[cur_question].d_cn;

            console.log(cur_word);
            c_def = cn_def(c_def);

            // Update current chinese definition
            $('#gameTxt').text(c_def);
            
            // Update first letter of the word to tip player.
            cur_word = cur_word.toUpperCase();
            //$('#gameInput').val(cur_word[0]);
            $('#gameInput').attr("placeholder", cur_word[0]);

            // Show 1st hint after 5 second
            hintTrigger5s = setTimeout(function(){pControl.creatHint5s(cur_word);},5000);
            // Show full hint after 10 second
            hintTrigger10s = setTimeout(function(){pControl.creatHint10s(cur_word);},10000);

            function cn_def(c_def){
                var cn_json;
                var x,cn_str='';

                // Check if this is a JSON string
                try {
                    cn_json=JSON.parse(c_def);
                    for (x in cn_json) {
                        var cn_split = cn_json[x].split("|");
                        cn_str = cn_str+cn_split[1]+"\n";
                    }
                } catch (e) {
                    cn_json = c_def;
                    var cn_split = cn_json.split("|");
                    cn_str = cn_str+cn_split[1]+" ";
                }

                return cn_str;
            }
        },

        clearAll: function(){
            // Clear game page
            $('.container').remove();

            // Load result page
            $(document.body).load( "./result.html .container", function() {
                rControl.generateResult();
            });
        },

        restart: function(){
            // Reset all variable
            qTopic_arr = [];
            json_str = [];
            answerRecord = [];
            cur_question = 0;
            actionStatus = 0;

            // Send a websocket request, request for a new set of questions
            ws.send(JSON.stringify({"event":"getQ"}));

            // Clear result page
            $('.container').remove();

            // Load game page
            $(document.body).load( "./index.html .container",function(){
                // Start up the game
                animation.init();
                //hpW = 9000;
            });

        }
    };
});