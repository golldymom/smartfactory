const logger = require('../lib/logger');
// const hashUtil = require('../lib/hashUtil');
const edukitDao = require('../dao/edukitDao');

const service = {
  //  입력
  async reg(params) {
    let inserted = null;

    try {
      inserted = await edukitDao.insert(params);
      logger.debug(`(edukitDaoService.reg) ${JSON.stringify(inserted)}`);
    } catch (err) {
      logger.error(`(edukitDaoService.reg) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(inserted);
    });
  },

  // selectList
  async list(params) {
    let result = null;

    try {
      result = await edukitDao.selectList(params);
      logger.debug(`(edukitService.list) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(edukitService.list) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },
  // selectInfo
  async info(params) {
    let result = null;

    try {
      result = await edukitDao.selectInfo(params);
      logger.debug(`(edukitDaoService.info) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(edukitDaoService.info) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },
  // update
  async edit(params) {
    let result = null;

    try {
      result = await edukitDao.update(params);
      logger.debug(`(edukitDaoService.edit) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(edukitDaoService.edit) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },
  // delelte
  async delete(params) {
    let result = null;

    try {
      result = await edukitDao.delete(params);
      logger.debug(`(edukitDao.delete) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(edukitDao.delete) ${err.toString()}`);
      return new Promise((resolve, reject) => {
        reject(err);
      });
    }

    return new Promise((resolve) => {
      resolve(result);
    });
  },

};

module.exports = service;
