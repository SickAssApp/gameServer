//define(function () {
define(['require', './process'], function (require) {
    var coin_trigger = 0;
    var stage, w, h, loader;
    var grant, ground, hill, hill2, gold_coin, rectangle; // Sprite Object

    //var process = require('./process');

    return {    
        init: function() {
            stage = new createjs.Stage(document.getElementById("animateCanvas1"));

            // grab canvas width and height for later calculations:
            w = stage.canvas.width;
            h = stage.canvas.height;
            manifest = [
                {src: "mario.png", id: "grant"},
                {src: "coin.png", id: "coin"},
                {src: "ground.png", id: "ground"},
                {src: "tree.png", id: "hill"},
                {src: "tree.png", id: "hill2"}
            ];

            loader = new createjs.LoadQueue(false);
            loader.addEventListener("complete", handleComplete);
            loader.loadManifest(manifest, true, "./res/");
        
            function handleComplete() {
                // examples.hideDistractor();

                // sky = new createjs.Shape();
                // sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);

                var groundImg = loader.getResult("ground");
                ground = new createjs.Shape();
                ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
                ground.tileW = groundImg.width;
                ground.y = h - groundImg.height;

                hill = new createjs.Bitmap(loader.getResult("hill"));
                hill.setTransform(Math.random() * w, h - hill.image.height * 4 - groundImg.height, 4, 4);
                hill.alpha = 0.5;

                hill2 = new createjs.Bitmap(loader.getResult("hill2"));
                hill2.setTransform(Math.random() * w, h - hill2.image.height * 3 - groundImg.height, 3, 3);

                // ------ Create spriteseet ------
                var spriteSheet = new createjs.SpriteSheet({
                        framerate: 30,
                        "images": [loader.getResult("grant")],
                        "frames": {"regX": 0, "height": 40,"space":1, "count": 6, "regY": 0, "width": 19},
                    // define two animations
                        "animations": {
                            "run": [0, 2, "run"],
                            "jump": [3, 5,"run"]
                        }
                    });
                //console.log(spriteSheet);
                var coin_spriteSheet = new createjs.SpriteSheet({
                    framerate: 16,
                    "images": [loader.getResult("coin")],
                    "frames": {"regX": 0, "height": 16,"space":1, "count": 4, "regY": 0, "width": 12},
                    // define two animations
                    "animations": {
                        "run": [0, 3, "coin_pop"]
                    }
                });
                // --------- End ----------

                // Draw Health bar
                rectangle = new createjs.Shape();
                //rectangle.graphics.beginFill("red").drawRect(10, 10, 90, 10);
                hpW = 9000;

                // Create Mario
                grant = new createjs.Sprite(spriteSheet, "run");
                var grant_h = stage.canvas.height-61;
                grant.y = grant_h;
                grant.x = 100;

                // Create Coin
                gold_coin = new createjs.Sprite(coin_spriteSheet, "coin_pop");
                gold_coin.alpha = 0;
                gold_coin.y = grant.y;
                gold_coin.x = grant.x + 4;

                stage.addChild(hill, hill2, ground, grant, gold_coin,rectangle);
                stage.addEventListener("stagemousedown", handleJumpStart);

                createjs.Ticker.timingMode = createjs.Ticker.RAF;
                createjs.Ticker.addEventListener("tick", tick);
            }


            function tick(event) {
                var deltaS = event.delta / 1000;

                rectangle.graphics.clear();
                hpW -= 10;
                //console.log(hpW);

                rectangle.graphics.beginFill("red").drawRect(10, 10, hpW/100, 10);

                // Coin animation Control
                if(coin_trigger==1){
                    gold_coin.y -= 1;
                    //console.log(gold_coin.y);

                    if(gold_coin.y > 120){
                        gold_coin.alpha -= 0.05;
                    }else if(gold_coin.y < 120){
                        gold_coin.alpha = 0;
                        gold_coin.y = grant.y;
                        gold_coin.x = grant.x + 4;
                        coin_trigger = 0;
                    }
                }

                // Ground Animation Control
                ground.x = (ground.x - deltaS * 150) % ground.tileW;
                hill.x = (hill.x - deltaS * 30);
                if (hill.x + hill.image.width * hill.scaleX <= 0) {
                    hill.x = w;
                }
                hill2.x = (hill2.x - deltaS * 45);
                if (hill2.x + hill2.image.width * hill2.scaleX <= 0) {
                    hill2.x = w;
                }

                if(hpW==0){
                    stage.removeEventListener();
                    stage.removeAllChildren();
                    createjs.Ticker.removeEventListener("tick", tick);

                    require(['./process'], function (process) {
                        process.clearAll();
                    });
                }

                stage.update(event);
            }

            function handleJumpStart() {
                grant.gotoAndPlay("jump");
            }
        },

        jumpStart: function() {
            //Useless but I'm too lazy to change this
            if(actionStatus==0){
                grant.gotoAndPlay("jump");
                actionStatus = 1;
            }else{
                grant.gotoAndPlay("jump");
                actionStatus = 0;
            }
        },

        fxblink: function(){
            coin_trigger = 1;
            gold_coin.alpha = 1;
        }
        
    };
});