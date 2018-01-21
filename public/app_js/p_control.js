// General page control
define(function () {
    return {
        creatHint5s: function(cur_word){
            cur_word = cur_word.toLowerCase();
            var cutted = cur_word.match(/^[A-Za-z]([A-Za-z]*)[A-Za-z]$/);

            var underline='';
            var x = cutted[1].length;
            console.log(x);

            for(var i=0;i<x;i++){
                underline += '_';
            }

            cur_word = cur_word.replace(cutted[1],underline);

            //$('#gameInput').val(cur_word[0].toUpperCase()+cur_word.substring(1));
            $('#hintText').text(cur_word[0].toUpperCase()+cur_word.substring(1));
        },

        creatHint10s: function(cur_word){
            cur_word = cur_word.toLowerCase();

            var hintText;
            hintText = cur_word[0].toUpperCase()+cur_word.substring(1);

            $('#hintText').text(hintText);
            $('#colorHint').text(" 請輸入正確答案");
            $('#colorHint').css( "color", "red" );
        },

        successBehavior: function(){
            // Reset everything first
            $('#gameInput').val("");
            $('#hintText').text("");
            $('#colorHint').text("");

            // Grant user more hitpoint
            hpW += 4000;
        }
	};
});