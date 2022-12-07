const { sequelize } = require('./connection');

// 연결
const Edukit = require('./edukit');
const User = require('./user');
const Takeover = require('./takeover');
// const Device = require('./device');

// 빈객체생성
const db = {};

db.sequelize = sequelize;

// model 생성

db.Edukit = Edukit;
db.User = User;
db.Takeover = Takeover;
// db.Device = Device;

// model init
Edukit.init(sequelize);
User.init(sequelize);
Takeover.init(sequelize);
// Device.init(sequelize);

// association(관계 생성) 이해를 위해 하나씩 관계설정함 아래는 한번에 설정
// Object.keys(db).forEach(modelName => {
//     if (db[modelName].associate) {
//       db[modelName].associate(db);
//     }
//   });

// association(관계 생성)
Edukit.associate(db);
User.associate(db);
Takeover.associate(db);

module.exports = db;
