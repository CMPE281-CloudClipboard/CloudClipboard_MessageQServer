var AWS = require('aws-sdk');
var util = require('util');
var key = require('./key-AWS');

//configure AWS
AWS.config.update({
	accessKeyId: key.keyJSON.accessKeyId,  // can omit access key and secret key
	secretAccessKey: key.keyJSON.secretAccessKey,
    "region": "us-east-1"
});

var sns = new AWS.SNS();

exports.publish = function(publishParams, callback) {
  
  console.log(publishParams);
  sns.publish(publishParams, function(err, result) {
  	console.log(publishParams.Message);
	  if (err !== null) {
			console.log(util.inspect(err));
			return callback(err);
	  }
	  else{
	  console.log("result :"+JSON.stringify(result));
	  callback(null, result);
	}
  });
}
