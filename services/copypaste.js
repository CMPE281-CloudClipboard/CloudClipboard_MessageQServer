"use strict"
var db = require("./database/dynamoDB");

exports.copy=function(msg, callback) {
   // var queryJSON = {"username": msg.userId};
    console.log("In copypaste sdfgsdfg function");
    var date = new Date();
    var email_ts = msg.email + date;
    console.log("this");
    var insertJSON = {"email_timestamp": email_ts,"email": msg.email,"text": msg.text,"fav_flag": msg.fav_flag};
    console.log("try"+JSON.stringify(insertJSON));
    var callbackFunction = function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            var jsonResponse={"insertcopyresults":result};
            //res.customerDetails=result;
            callback(null, jsonResponse);
        }
    }

    
    db.insertOne("Clipboard", insertJSON, callbackFunction);
}

