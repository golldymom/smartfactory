const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      factoryname: {
        type: Sequelize.STRING(100),
      },
      userid: {
        type: Sequelize.STRING(255),
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(255),
      },
      phone: {
        type: Sequelize.STRING(255),
      },
      updatedPwDate: {
        type: Sequelize.DATE,
      },
    }, {
      sequelize,
      // tableName: 'tableName', // table명을 수동으로 생성 함
      // freezeTableName: true, // true: table명의 복수형 변환을 막음
      underscored: true, // true: underscored, false: camelCase
      timestamps: false, // createAt, updatedAt
      paranoid: false, // deletedAt
    });
  }

  static associate(db) {
    db.User.hasMany(db.Edukit, { foreignKey: 'companyId', sourceKey: 'userid' });
    db.User.hasMany(db.Takeover, { foreignKey: 'companyId', sourceKey: 'userid' });
  }
};
