define(function () {
    return {
    	openWsConnect: function (websocketServerLocation) {
            ws = new WebSocket(websocketServerLocation);
			ws.onopen=function(){						
				ws.send(JSON.stringify({"event":"onopen"}));
			}
			ws.onclose = function(){						
				ws.send("Offline.");
			};
			return ws;
    	}
	};
});