const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const logger = require('morgan'); // 구코드 삭제
const bodyParser = require('body-parser');
const cors = require('cors');
const internal = require('stream');
const mysql = require('mysql');
const corsConfig = require('./config/corsConfig.json');
const models = require('./models/index');
const logger = require('./lib/logger');
const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users'); // 구코드 삭제
const mqtts = require('./models/mqtts');
const { sequelize } = require('./models');

const app = express();
logger.info('app start');

// const client = mqtt.connect('mqtt:192.168.0.79:1555'); // 호진씨 주소

// client.on('connect', () => {
//   client.subscribe('myEdukit', (err) => {
//     if (!err) {
//       console.log('mqtt-wrapper : connected!');
//     }
//   });
// });

// client.on('message', (myEdukit, message) => {
//   // message is Buffer
//   console.log(message.toString());
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// DB 연결 확인 및 table 생성
models.sequelize.authenticate().then(() => {
  logger.info('DB connection success');

  // sequelize sync (table 생성)
  models.sequelize.sync().then(() => {
    logger.info('Sequelize sync success');
  }).catch((err) => {
    logger.error('Sequelize sync error', err);
  });
}).catch((err) => {
  logger.error('DB Connection fail', err);
});

// app.use(logger('dev')); // 구코드 삭제
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
// app.use('/users', usersRouter); // 구코드 삭제

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
