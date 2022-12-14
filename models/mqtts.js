// const { text } = require('body-parser');
const mqtt = require('mqtt');
// const { connection } = require('mysql2');
// const mysql = require('mysql2');
const db = require('./index');

const { Edukit, sequelize } = require('./index');

// const conn = mysql.createConnection(connection);

let changeDetector = false; // 시작정지 감지
let emergencyDetector = false; // 비상정지 감지
let prossecing = false; // 작업중 표시변수
let cnt = 0;

const client = mqtt.connect('mqtt:192.168.0.79:1888');

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

  // // 비상정지 시작시    1초 뒤 인식
  if (obj.Wrapper[27].value === false && emergencyDetector === false) {
    setTimeout(() => {
      cnt += 1;
      if (obj.Wrapper[27].value === false && cnt === 1) {
        if (prossecing === true) { // 작업중 비상정지의 경우
          Edukit.max('id').then((max) => {
            Edukit.update({
              eStop: 'O', // 비상정지 여부를 업데이트
              estopRuntime: Date.now(), // 비상정지 시작시간 업데이트
            }, { where: { id: max } });
          });
        } else {
          // 작업중이 아닌 비상정지의 경우
          Edukit.create({ // 작업생성 후  비상정지 여부 표시
            eStop: 'O',
            pdStartTime: Date.now(),
            estopRuntime: Date.now(), // 비상정지 시작시간 기록시작
          });
        }
        emergencyDetector = true;
        setTimeout(() => { cnt = 0; }, 1000);
      }
    }, 1000);
  }

  // 비상정지 종료시  1초 뒤 인식

  if (obj.Wrapper[27].value === true && emergencyDetector === true) {
    setTimeout(() => {
      if (emergencyDetector === true) {
        Edukit.max('id').then((max) => {
          Edukit.update({
            pdEndTime: Date.now(),
            estopCleartime: Date.now(), // 비상정지 종료시간 업데이트
          }, { where: { id: max } });
        });
        emergencyDetector = false;
        prossecing = false;
      }
    }, 1000);
  }

  // 작업 시작 여부 변화 감지 (작업 시작시 한번만 실행)

  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === true) {
    changeDetector = obj.Wrapper[6].value;
    const testMake = await Edukit.create({
      eStop: 'X',
      pdStartTime: Date.now(),
    });
    // const tset = await Edukit.findOne();
    // console.log("Jane's auto-generated ID:", tset);
  }

  // // 작업이 끝나면 한번만 실행
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[31].value !== 0) {
    const nowOutput = obj.Wrapper[31].value; // 1호기 카운트, 총 생산량
    const goods = obj.Wrapper[32].value; // 2호기 카운트, 양품 생산량
    const detective = nowOutput - goods; // 총생산량 - 양품생산량, 불량품
    changeDetector = obj.Wrapper[6].value;
    // const resents = await sequelize.query('SELECT id FROM edukits ORDER BY id DESC LIMIT 1');
    // console.log(resents);
    Edukit.max('id').then((max) => {
      Edukit.update({ // 계산된 작업량 DB 업데이트
        firOutput: nowOutput,
        pdEndTime: Date.now(),
        thrGoodset: goods,
        gappyProduct: detective,
      }, {
        where: { id: max }, // 가장 최근 작업에 업로드
      });
    });

    // 비상정지에 의한 작업종료시
    if (obj.Wrapper[27].value === false) {
      prossecing = true; // 작업중 표시
    }
  }
});
