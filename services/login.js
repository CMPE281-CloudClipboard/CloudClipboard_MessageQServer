//var mac = require('getmac');
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
            console.log("Signup"+result);
            var callbackFunctionMac = function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("MAC "+result);
                    var jsonResponse={"userDetails":result};
                    callback(null, jsonResponse);
                }
            }

            db.insertOne("registered_devices", msg.macJSON, callbackFunctionMac);

            var jsonResponse={"userDetails":result};
        /*var callbackFunction = function (err, result) {
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
        db.findOne("registered_devices", msg.macJSON.email_mac, callbackFunction);*/
            //res.customerDetails=result;
            callback(null, jsonResponse);
        }
    }
    db.insertOne("Users", msg.signupJSON, callbackFunction);
}

exports.addMacAddr = function(msg,callback){
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
    db.findAndAdd("registered_devices", msg, callbackFunction);
}