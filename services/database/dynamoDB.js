var AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
   accessKeyId: 'AKIAJX6JLJFIRY6OUO7Q',  // can omit access key and secret key 
  secretAccessKey: '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'
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