
var db = require("./database/dynamoDB");

exports.doLogin=function(msg, callback) {
   // var queryJSON = {"username": msg.userId};
    console.log(msg);
    console.log("--->>>>");
    var callbackFunction = function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            var jsonResponse={"userDetails":result};
            //res.customerDetails=result;
            callback(null, jsonResponse);
        }
    }
    db.findOne("Users", msg, callbackFunction);
}

exports.doSignup=function(msg, callback) {
   // var queryJSON = {"username": msg.userId};
    console.log(msg);
    console.log("--->>>>");
    var callbackFunction = function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result);
            var jsonResponse={"userDetails":result};
            //res.customerDetails=result;
            callback(null, jsonResponse);
        }
    }
    db.insertOne("Users", msg, callbackFunction);
}