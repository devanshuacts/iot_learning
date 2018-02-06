var opcua = require("node-opcua");
var async = require("async");
var kafka_producer = require("../kafka_producer");

var client = new opcua.OPCUAClient();
var endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

var the_session, the_subscription;

function make_callback(_nodeId) {

    var nodeId = _nodeId;
    return  function(dataValue) {
        data_value = dataValue.value.value.toString()
        console.log(nodeId.toString() , "\t value : ",data_value);
        payload = [
          { topic: 'test',  messages: data_value,  partition: 0 },
          {topic: 'test', messages: ['hello from opcua']}
        ]

        kafka_producer.send(payload, function (err, data) {
            console.log('data sent to kafka' + data);
        });

        kafka_producer.on('error', function (err) {
          console.log(err);
        });
   };
}

exports.monitoring = function(req, res, next){
  async.series([

    function (callback){
      client.connect(endpointUrl,function (err) {
        if(err) {
            console.log(" cannot connect to endpoint :" , endpointUrl );
            //return next(err);
        } else {
            console.log("connected !");
            res.send("monitoring started\n")
        }
        callback(err);
      });
    },

    function (callback){
      client.createSession( function(err,session) {
        if(!err) {
            the_session = session;
        }
        callback(err);
      });
    },


    function (callback){
      the_subscription=new opcua.ClientSubscription(the_session, {
          requestedPublishingInterval: 150,
          requestedLifetimeCount: 10 * 60 * 10,
          requestedMaxKeepAliveCount: 10,
          maxNotificationsPerPublish: 2,
          publishingEnabled: true,
          priority: 6
      });

      the_subscription.on("started",function(){
          console.log("subscription started for 2 seconds - subscriptionId=",the_subscription.subscriptionId);
      }).on("keepalive",function(){
          console.log("keepalive");
      }).on("terminated",function(){
          callback();
      });

      var ids = ["ns=1;s=free_memory", "ns=1;b=1020FFBB"];
      ids.forEach(function(id){
          var nodeId = id;
          var monitoredItem = the_subscription.monitor(
              {nodeId: opcua.resolveNodeId(nodeId), attributeId: opcua.AttributeIds.Value},
              {samplingInterval: 10, discardOldest: true, queueSize: 1});
          monitoredItem.on("changed",make_callback(nodeId));
      });


      setTimeout(function() {
          the_subscription.terminate();
      },5000);
    },

    function(callback) {
      the_session.close(function(err){
        if(err) {
            console.log("session closed failed ?");
        }
        callback();
      });
    }

  ],

  function(err) {
      if (err) {
          console.log(" failure ",err);
          return next(err);
      } else {
          console.log("done!");
      }
      client.disconnect(function(){});
  }) ;
}
