const Sequelize = require('sequelize');

module.exports = class Takeover extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      takeoverDate: {
        type: Sequelize.DATE,
      },
      tTitle: {
        type: Sequelize.STRING(255),
        // unique: true,
        allowNull: false,
      },
      tContents: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      tName: {
        type: Sequelize.STRING(255),
        allowNull: false,

      },
    }, {
      sequelize,
      // tableName: 'tableName', // table명을 수동으로 생성 함
      // freezeTableName: true, // true: table명의 복수형 변환을 막음
      underscored: false, // true: underscored, false: camelCase
      timestamps: false, // createAt, updatedAt
      paranoid: false, // deletedAt
    });
  }
  // test

  static associate(db) {
    db.Takeover.belongsTo(db.User, { foreignKey: 'companyId', targetKey: 'id' });
  }
};
