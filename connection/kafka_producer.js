var kafka = require('kafka-node');

const client = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});

var producer = new kafka.Producer(client);
// payload = [
//   { topic: 'test',  messages: 'hi',  partition: 0 },
//   {topic: 'test', messages: ['hello', 'world']}
// ]
//
// producer.on('ready', function () {
//     producer.send(payload, function (err, data) {
//         console.log(data);
//     });
// });
//
// producer.on('error', function (err) {
//   console.log(err);
// });

module.exports = producer
