const mqtt = require('mqtt');

let changeDetector = true;

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
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === true) {
    changeDetector = obj.Wrapper[6].value;
  }
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[31].value !== 0) {
    const nowOutput = obj.Wrapper[31].value;
    const goods = obj.Wrapper[32].value;
    const detective = nowOutput - goods;
    console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);
    changeDetector = obj.Wrapper[6].value;
  }
});
