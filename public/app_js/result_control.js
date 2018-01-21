/**
 * Created by jim on 15/3/27.
 */
define(function () {
    return {
        generateResult: function (){
            // answer can be found in process.js
            var showTxt = JSON.stringify(answerRecord);
            //console.log(answerRecord);
            $('#resultTxt').text(showTxt);
        }
    };
});