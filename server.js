var amqp = require('amqp')
    , util = require('util')

var login = require('./services/login');
var copypaste = require('./services/copypaste');

var cnn = amqp.createConnection({host:'127.0.0.1'});

cnn.on('ready', function(){
    console.log("listening on login queue");
    // Gaurav  enter heree
    cnn.queue('LOGIN_QUEUE', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            
                login.doLogin(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            
        });
    });

    cnn.queue('MAC_QUEUE', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            
                login.addMacAddr(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            
        });
    });
     console.log("listening on copy queue");
    cnn.queue('COPY_QUEUE', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            
                copypaste.copy(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            
        });
    });

    cnn.queue('SIGNUP_QUEUE', function(q){
        q.subscribe(function(message, headers, deliveryInfo, m) {
            util.log(util.format(deliveryInfo.routingKey, message));
            util.log("Message: " + JSON.stringify(message));
            util.log("DeliveryInfo: " + JSON.stringify(deliveryInfo));
            
                login.doSignup(message, function (err, res) {

                    //return index sent
                        cnn.publish(m.replyTo, res, {
                        contentType: 'application/json',
                        contentEncoding: 'utf-8',
                        correlationId: m.correlationId
                    });

                });
            
        });
    });
});