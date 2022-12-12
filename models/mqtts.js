// const { text } = require('body-parser');
const mqtt = require('mqtt');
// const { connection } = require('mysql2');
// const mysql = require('mysql2');
const db = require('./index');

const { Edukit, sequelize } = require('./index');

// const conn = mysql.createConnection(connection);

let changeDetector = false; // 시작정지 감지  test 한다고 투루로 함. 원래 펄스
let emergencyDetector = false; // 비상정지 감지
let prossecing = false; // 작업중 표시변수

const client = mqtt.connect('mqtt:192.168.0.79:1555');

client.on('connect', () => {
  client.subscribe('myEdukit', (err) => {
    if (!err) {
      console.log('mqtt-wrapper : connected!');
    }
  });
});

// 6 - 컨베이어벨트 작동 여부 -boolean
// 31 - 1호기 투입량 카운트
// 32 - 2호기 생산량 카운트
// 33 - 3호기 생산량 카운트
// 27 - 비상정지 여부 - boolean
// 34 - 3호기 x축
// 35 - 3호기 y축

client.on('message', async (myEdukit, message) => {
  const obj = JSON.parse(message.toString());

  // // 비상정지 시작시
  if (obj.Wrapper[27].value === false && emergencyDetector === false) {
    emergencyDetector = true;
    setTimeout(() => {
      if (obj.Wrapper[27].value === false) {
        if (prossecing === true) {
          console.log('작업중 비상정지의 경우');
        } else {
          console.log('작업중이 아닌 비상정지의 경우');
        }
        console.log('비상정지 기록시작시점');
        emergencyDetector = true;
      }
    }, 1000);
  }

  // 비상정지 종료시

  if (obj.Wrapper[27].value === true && emergencyDetector === true) {
    setTimeout(() => {
      if (emergencyDetector === true) {
        if (prossecing === true) {
          console.log('작업중 비상정지의 경우');
        } else {
          console.log('작업중이 아닌 비상정지의 경우');
        }
        console.log('비상정지 기록정지시점');
        emergencyDetector = false;
        prossecing = false;
      }
    }, 1000);
  }

  // 작업 시작 여부 변화 감지 (작업 시작시 한번만 실행)

  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === true) {
    changeDetector = obj.Wrapper[6].value;
    const testMake = await Edukit.create({
      eStop: 'here',
      pdStartTime: Date.now(),
    });
    // test: id 추출
    if (testMake) {
      const result = await sequelize.query('SELECT id from edukits');
      console.log(result);
    }
    console.log('data');
  }

  // // 작업이 끝나면 한번만 실행
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[31].value !== 0) {
    const nowOutput = obj.Wrapper[31].value;
    const goods = obj.Wrapper[32].value;
    const detective = nowOutput - goods;
    console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);
    changeDetector = obj.Wrapper[6].value;

    // const b = Edukit.update({
    //   firOutput: nowOutput,
    //   pdEndTime: Date.now(),
    //   thrGoodset: goods,
    //   gappyProduct: detective,
    // });

    // console.log('b-data', b);

    // 비상정지에 의한 작업종료시
    if (obj.Wrapper[27].value === false) {
      console.log('비상정지 여부표시');
      prossecing = true;
    }
  }
});
