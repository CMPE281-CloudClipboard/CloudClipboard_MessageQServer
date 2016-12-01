"use strict"
var db = require("./database/dynamoDB");
var sqs_sns_publish = require('../publish');

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



    var selectQuery = "email = "+ msg.email;
    var callbackFunction = function(err, result) {
        if (err) {
            console.log(err);
        }
        else {

            result.Items.forEach(function(record){
                console.log(record);
                if(record.email==msg.email){
                    var publishParams = { 
                          TopicArn : record.topic_arn,
                          Message: msg.text
                      };


                    sqs_sns_publish.publish(publishParams, function (err, results) {
                    //console.log(copiedText);
                    if(err)
                    {
                        throw err;
                    }
                    else
                    {
                        // console.log("Message has been successfully published");
                    }

                });
            }
            });


        }
    }

    db.find("registered_devices",selectQuery,callbackFunction);


}

