const { text } = require('body-parser');
const mqtt = require('mqtt');
// const { now } = require('sequelize/types/utils');
// const { create } = require('./edukit');
const { Edukit } = require('./index');

const changeDetector = true;
const client = mqtt.connect('mqtt:192.168.0.79:1555');

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
  // console.log(obj.Wrapper[6].value); // ->스타트
  // console.log(obj.Wrapper[26].value); // ->이머전시
  // console.log(obj.Wrapper[34].value); // ->3호기 모터 x
  // console.log(obj.Wrapper[35].value);// ->3호기 모터 y
  // console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);

  client.publish('stupid', 'Hi');
  // console.log(obj.Wrapper[19]); // 양품, true, false
  // console.log(obj.Wrapper[31]); // 1호기 생산, count
  // console.log(obj.Wrapper[33]); // 3호기 생산, count
  // console.log(obj.Wrapper[27]); // emergency, true, false
  const now = 'true';
  // Edukit.create({
  //   eStop: obj.Wrapper[27].value,
  //   firOutput: obj.Wrapper[16].value,
  //   thrGoodset: obj.Wrapper[19].value,
  //   pdStartTime: Date.now(),
  // });

  // if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === true) {
  //   changeDetector = obj.Wrapper[6].value;
  //   console.log(changeDetector);
  // }
  // if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[31].value !== 0) {
  //   const nowOutput = obj.Wrapper[31].value;
  //   const goods = obj.Wrapper[32].value;
  //   const detective = nowOutput - goods;
  //   console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);
  //   changeDetector = obj.Wrapper[6].value;
  // }
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === false) {
    console.log('no', changeDetector);
    // textTest = 'no';
    Edukit.findOrCreate({
      where: {
        eStop: now,
        pdStartTime: Date.now(),
        firOutput: obj.Wrapper[31].value,
        pdEndTime: '2022.12.9',
      },
    });
  }
});
