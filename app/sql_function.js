var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '97459312',
  database : 'game_data'
});

//var elweb = mysql.createConnection({
//  host     : '123.57.137.97',
//  user     : 'elweb',
//  password : 'macabre0619',
//  database : 'elite_study'
//});

var self={
	elweb:function(){

		connection.connect();

		connection.query('SELECT * from account where name = "test01";', function(err, rows, fields) {
		  if (!err)
		    return rows;
		  else
		    console.log('Error while performing Query.');
		});

		connection.end();
	},

    // Get word from ENGLISH database
	getWord:function(wsSocketObj,swk){
        var elweb = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : '97459312',
            database : 'game_data'
        });

		// connection
		var maxid,json_result;
		elweb.connect();

		elweb.query('SELECT MAX(id) as maxID FROM voc_word;', function(err, rows, fields) {
		 if (!err) {
             console.log(rows[0].maxID);
              //maxid = rows[0].maxID;
         }else {
              console.log('Error while performing Query.');
         }
		});
        console.log(maxid);
        maxid = 7196;

		var randid = [];
		for(var i=0;i<10;i++){
			randid[i] = Math.floor((Math.random() * maxid) + 1);
		}

		var combinedID = randid.join();

		elweb.query('SELECT id as qid, word, d_cn FROM voc_word where id in ('+ combinedID +') order by rand();', function(err, rows, fields) {
                      if (!err) {
                          //console.log(rows);
                          json_result = JSON.stringify(rows);
                          if(json_result!='undefined'){
                              var msg={"event":"getQ","msg":json_result};
                              wsSocketObj.send(JSON.stringify(msg),swk);
                          }
                      }else{
                          console.log('Error while performing Query.');
                      }
                  });
		elweb.end();
        //return json_result;
	}
}

module.exports=self;