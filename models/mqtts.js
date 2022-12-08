const mqtt = require('mqtt');

const client = mqtt.connect('mqtt://localhost:1555');

client.on('connect', () => {
  client.subscribe('myEdukit', (err) => {
    if (!err) {
      console.log('mqtt-wrapper : connected!');
    }
  });
});

client.on('message', (myEdukit, message) => {
  // message is Buffer
  const obj = JSON.parse(message.toString());
  const nowOutput = obj.Wrapper[31].value;
  const goods = obj.Wrapper[32].value;
  const detective = nowOutput - goods;

  console.log(obj.Wrapper[6].value);
  console.log(obj.Wrapper[26].value);
  console.log(obj.Wrapper[34].value);
  console.log(obj.Wrapper[35].value);
  console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);
  client.publish('stupid', 'Hi');
});
