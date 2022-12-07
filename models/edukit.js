const Sequelize = require('sequelize');

module.exports = class Edukit extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      eStop: {
        type: Sequelize.STRING(100),
      },
      pdStartTime: {
        type: Sequelize.DATE,
        unique: true,
        allowNull: false,
      },
      pdEndTime: {
        type: Sequelize.DATE,
      },
      firOutput: {
        type: Sequelize.INTEGER,

      },
      thrGoodset: {
        type: Sequelize.INTEGER,
        // allowNull: false,
      },
      gappyProduct: {
        type: Sequelize.INTEGER,
      },
      estopRuntime: {
        type: Sequelize.DATE,
      },
      estopCleartime: {
        type: Sequelize.DATE,
      },

    }, {
      sequelize,
      // tableName: 'tableName', // table명을 수동으로 생성 함
      // freezeTableName: true, // true: table명의 복수형 변환을 막음
      underscored: true, // true: underscored, false: camelCase
      timestamps: true, // createAt, updatedAt
      paranoid: true, // deletedAt
    });
  }

  static associate(db) {
    db.User.belongsTo(db.User, { foreignKey: 'companyId ', targetKey: 'userid' });
  }
};
