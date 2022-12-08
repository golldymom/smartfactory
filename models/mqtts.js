const mqtt = require('mqtt');
// const { now } = require('sequelize/types/utils');
// const { create } = require('./edukit');
const { Edukit } = require('./index');

<<<<<<< HEAD
const client = mqtt.connect('mqtt:192.168.0.79:1555');
=======
let changeDetector = true;

const client = mqtt.connect('mqtt://localhost:1555');
>>>>>>> 548269fba768f8ba1f71832058565b4b0adc0fd5

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

  // console.log('obj', obj);
  console.log(obj.Wrapper[6].value);
  console.log(obj.Wrapper[26].value);
  console.log(obj.Wrapper[34].value);
  console.log(obj.Wrapper[35].value);
  console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);

  client.publish('stupid', 'Hi');

  Edukit.create({
    eStop: obj.Wrapper[0].value,
    firOutput: obj.Wrapper[34].value,
    pdStartTime: Date.now(),
  });
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
