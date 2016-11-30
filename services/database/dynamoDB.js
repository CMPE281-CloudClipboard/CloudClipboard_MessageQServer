var AWS = require("aws-sdk");
var key = require('./key');

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
                var params = {
                  TableName: tableName,
                  Item:queryJSON
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
          else{
            console.log("Added item:", JSON.stringify(data, null, 2));
            callback(null,data);
          } 
      }
  });
}
