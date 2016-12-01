var AWS = require("aws-sdk");
var key = require('./key');

// SNS-SQS
var sqs_sns_inititate = require('./create');

AWS.config.update({
  region: "us-west-2",
  accessKeyId: key.keyJSON.accessKeyId,  // can omit access key and secret key
  secretAccessKey: key.keyJSON.secretAccessKey
});

var docClient = new AWS.DynamoDB.DocumentClient()

exports.findOne = function(tableName,queryJSON,callback){

	console.log("In DynamoDB");
	console.log(queryJSON);
	var params = {
     	TableName: tableName,
     	Key: queryJSON
	 };

    docClient.get(params, function(err, data) {
    	if (err) {
        	console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    	}
    	else {
        	console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
        	callback(null,data);
    	}
	});
}

exports.insertOne = function(tableName,queryJSON,callback){

  console.log("In DynamoDB");
 
  var params = {
      TableName: tableName,
      Item:queryJSON
   };

    console.log("Adding a new item...");
    docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
          callback(null,data);
    }
});
}

exports.findAndAdd = function(tableName,queryJSON,callback){

  console.log("In DynamoDB");
  console.log(queryJSON.email_mac);
  var params = {
      TableName: tableName,
      Key:{"email_mac" : queryJSON.email_mac}
   };

    docClient.get(params, function(err, data) {
      if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2)); 
      }
      else {
          console.log(data);
          if(JSON.stringify(data,null,2) == "{}"){
              console.log("---->>>>");
                


  console.log("queryJSON:"+ queryJSON.email_mac);
  var config = {};
  var queueName = queryJSON.email_mac.replace(/:/g,'').replace(/-/g,'').replace('@','').replace('.','');

	// SNS - SQS Code
	sqs_sns_inititate.createTopic(queueName, function (err, results) {
        if(err)
		{
			throw err;
		}
		else
		{
			config.TopicArn = results;
			console.log("Topic created");
			sqs_sns_inititate.createQueue(queueName, function (err, results) {
		        if(err)
				{
					throw err;
				}
				else
				{
					config.QueueUrl = results;
					console.log("URL:"+results);
					console.log("Queue created");
					sqs_sns_inititate.getQueueAttr(config.QueueUrl, function (err, results) {
				        if(err)
						{
							throw err;
						}
						else
						{
							config.QueueArn = results;
							console.log("Fetched queue attributes");
							// sqs_sns_inititate.snsSubscribe(config.TopicArn, config.QueueArn, function (err, results) {
						  //       if(err)
							// 	{
							// 		throw err;
							// 	}
							// 	else
							// 	{
							// 		console.log("Successfully subscribed");

							// 	}
						  //   });


						    sqs_sns_inititate.setQueueAttr(config.QueueUrl, config.TopicArn, config.QueueArn, function (err, results) {
						        if(err)
								{
									throw err;
								}
								else
								{
									console.log("Queue attributes set successfully");
								var params = {
                  TableName: tableName,
                  Item:{
                      "email_mac":queryJSON.email_mac,
                      "email" : queryJSON.email,
                      "mac" : queryJSON.mac,
                      "queue_url" : config.QueueUrl,
                      "topic_arn" : config.TopicArn,
                      "queue_arn" : config.QueueArn
                  }
                };

                console.log("Adding a new mac...");
                console.log(params);
                docClient.put(params, function(err, data) {
                if (err) {
                  console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                  console.log("Added item:", JSON.stringify(data, null, 2));
                  callback(null,data);
                }
              });

								}
						    });
						}
				    });
				}
		    });
		}
    });     
            
        }
          else{
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null,data);
          } 
      }
  });
}
