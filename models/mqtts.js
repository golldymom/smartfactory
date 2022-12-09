// const { text } = require('body-parser');
const mqtt = require('mqtt');
// const { now } = require('sequelize/types/utils');
// const { create } = require('./edukit');
const { Edukit } = require('./index');

let changeDetector = false; // 시작정지 감지
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

client.on('message', (myEdukit, message) => {
  const obj = JSON.parse(message.toString());
  console.log(obj.Wrapper[6].value);
  // 비상정지 종료시
  if (obj.Wrapper[27].value === true && emergencyDetector === true) {
    // 비상정지에 의한 작업종료시 해당작업의 비상정지해제 시간 분기점 필요
    if (prossecing === true) {
      console.log('작업중 비상정지의 경우');
    } else {
      console.log('작업중이 아닌 비상정지의 경우');
    }
    console.log('비상정지 기록정지시점');
    emergencyDetector = false;
    prossecing = false;
  }
  // 비상정지 시작시
  else if (obj.Wrapper[27].value === false && emergencyDetector === false) {
    emergencyDetector = true;
    if (prossecing === true) {
      console.log('작업중 비상정지의 경우');
    } else {
      console.log('작업중이 아닌 비상정지의 경우');
    }
    console.log('비상정지 기록시작시점');
  }
  // 작업 시작 여부 변화 감지 (작업 시작시 한번만 실행)
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[6].value === true) {
    changeDetector = obj.Wrapper[6].value;
    console.log('here');
  }
  // 작업이 끝나면 한번만 실행
  if (changeDetector !== obj.Wrapper[6].value && obj.Wrapper[31].value !== 0) {
    const nowOutput = obj.Wrapper[31].value;
    const goods = obj.Wrapper[32].value;
    const detective = nowOutput - goods;
    console.log('현재 생산량 : %d 현재 양품 생산량 : %d, 현재 불량품 : %d', nowOutput, goods, detective);
    changeDetector = obj.Wrapper[6].value;
    // 비상정지에 의한 작업종료시
    if (obj.Wrapper[27].value === false) {
      console.log('비상정지 여부표시');
      prossecing = true;
    }
  }
});
