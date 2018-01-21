var express = require('express');
var path = require('path');
var http = require('http');
// Declare sql utility
// var sql_func = require('./app/sql_function');

var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');

var WebSocketServer = require('ws').Server;

var app = express();
app.set('port', process.env.PORT ||8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

server=http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var wsServer=new WebSocketServer({ server:server });
var sid="";

//======事件====
//廣播功能
//swk空白就是廣播給所有人
//或是swk給值
wsServer.broadcast=function(data,swk){
  //跑回圈送出
    for(var i in this.clients){
    //送給某個Client
      if(swk==""){
        this.clients[i].send(data); 
      }else{
        if(this.clients[i].upgradeReq.headers['sec-websocket-key']==swk){
          this.clients[i].send(data);
        }
      }
    }
}

//===========wsServer on   Start==========
//If the underlying server emits an error, it will be forwarded here.
wsServer.on("error",function(error){
  console.log(error);
});
//Emitted with the object of HTTP headers that are going to be written to the Stream as part of the handshake.
wsServer.on("headers",function(headers){
  for(n in wsServer.clients){
    console.log("header swk:"+wsServer.clients[n].upgradeReq.headers['sec-websocket-key']);
    var swk=wsServer.clients[n].upgradeReq.headers['sec-websocket-key']
  }
});
//When a new WebSocket connection is established. socket is an object of type ws.WebSocket.
wsServer.on("connection",function(wsSocketObj){
  console.log("protocolVersion:"+wsSocketObj.protocolVersion);
  console.log("readyState:"+wsSocketObj.readyState);

    if(wsSocketObj.readyState==1){
        console.log("***** Connection Opened! ******");
        var msg={"event":"openTrue","msg":"連線開啟"};
        var swk=wsSocketObj.upgradeReq.headers['sec-websocket-key'];
        wsSocketObj.send(JSON.stringify(msg),swk);
    }

  //ws的WebSocket事件有 websocket.onopen websocket.onerror websocket.onclose websocket.onmessage
  //websocket.onmessage
    wsSocketObj.on('ping',function(data){
        console.log("ping:"+data);
    });
    wsSocketObj.on('pong',function(data){
        console.log("pong:"+data);
    });
  //====================//

  wsSocketObj.on('message', function(jsDataString) {
    // Setup unique key.
    var swk=this.upgradeReq.headers['sec-websocket-key'];
    var jsDataObj=JSON.parse(jsDataString);//將Json字串變更為Json物件    
    //收到的事件命令
    if(jsDataObj.event!=null){
        switch(jsDataObj.event){
            case "broadcast":
            var msg={"event":"broadcast","msg":jsDataObj.msg};
            wsServer.broadcast(JSON.stringify(msg),"");
            break;
        case "message":
            var msg={"event":"message","msg":jsDataObj.msg};
            wsSocketObj.send(JSON.stringify(msg),swk);
            break;
        case "getQ":
            // Get question from database then send back to client.
            // sql_func.getWord(wsSocketObj,swk);
            break;
        }
      return false;
    }
  });
  //websocket.onclose
  wsSocketObj.on('close',function(event){
    var swk=this.upgradeReq.headers['sec-websocket-key'];
    console.log("client "+swk+" closed.");
  });

  process.memoryUsage();
  wsSocketObj.on('error',function(){
    console.log('error');
  });
});
//===========wsServer on End==========
//chkUpdate();
app.get('js/urlParam.js',function(req,res){
  console.log("load javascript");
  res.sendfile('./public/js/urlParam.js',function(err){

  });
});

app.get('/',function(req,res){
  res.sendfile('./public/index.html',function(err){
    if(err){
      console.log(err);
    }else{
      var sess=req.session;
      console.log(sess);
      sid=req.sessionID;
      console.log(sid);
      console.log('file sent');

    }
  })
});

app.use('/', routes);
app.use('/test',function(req,res,next){
  var sess=req.session;
  sess.name="test";
  console.log(sess);
  var sid=req.sessionID;
  res.send('welcome'+sid);
});

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

module.exports = app;
