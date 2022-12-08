const logger = require('../lib/logger');
// const hashUtil = require('../lib/hashUtil');
const takeoverDao = require('../dao/takeoverDao');

const service = {
  //  입력
  async reg(params) {
    let inserted = null;

    try {
      inserted = await takeoverDao.insert(params);
      logger.debug(`(takeoverService.reg) ${JSON.stringify(inserted)}`);
    } catch (err) {
      logger.error(`(takeoverService.reg) ${err.toString()}`);
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
      result = await takeoverDao.selectList(params);
      logger.debug(`(takeoverService.list) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(takeoverService.list) ${err.toString()}`);
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
      result = await takeoverDao.selectInfo(params);
      logger.debug(`(takeoverService.info) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(takeoverService.info) ${err.toString()}`);
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
      result = await takeoverDao.update(params);
      logger.debug(`(takeoverService.edit) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(takeoverService.edit) ${err.toString()}`);
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
      result = await takeoverDao.delete(params);
      logger.debug(`(takeoverService.delete) ${JSON.stringify(result)}`);
    } catch (err) {
      logger.error(`(takeoverService.delete) ${err.toString()}`);
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
