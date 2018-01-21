define(function () {
    return {        
        loadSound: function (){
            var soundID = "Thunder";
            createjs.Sound.registerSound("res/mario-jump.ogg", soundID);

            var coinSound = "Coin";
            createjs.Sound.registerSound("res/smb3_coin.ogg", coinSound);

            var growSound = "Grow";
            createjs.Sound.registerSound("res/smb3_vine.ogg", growSound);
        },
        
        playSound: function(){
            var soundID = "Thunder";
            createjs.Sound.play(soundID);
        },

        coinSound: function(){
            var coinSound = "Coin";
            createjs.Sound.play(coinSound);
        },

        growSound: function(){
            var growSound = "Grow";
            createjs.Sound.play(growSound);
        }
    };
});