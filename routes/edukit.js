const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
// const middleware = require('../lib/middleware');

// const { verifyToken } = require('../lib/tokenUtil');
const takeoverService = require('../service/takeoverService');

// 등록
router.post('/', async (req, res) => {
  try {
    const params = {
      // departmentId: req.body.departmentId,
      eStop: req.body.eStop,
      pdStartTime: req.body.pdStartTime,
      pdEndTime: req.body.pdEndTime,
      firOutput: req.body.firOutput,
      thrGoodset: req.params.thrGoodset,
      gappyProduct: req.params.gappyProduct,
      estopRuntime: req.params.estopRuntime,
      estopClear: req.params.estopClear,

    };
    // console.log('here', params);
    logger.info(`(takeover.reg.params) ${JSON.stringify(params)}`);

    // 입력값 null 체크
    if (!params.tTitle || !params.tContents || !params.takeoverDate || !params.tName) {
      const err = new Error('Not allowed null (tTitle, tContents, tName )');
      logger.error(err.toString());

      res.status(500).json({ err: err.toString() });
    }

    // 비즈니스 로직 호출
    const result = await takeoverService.reg(params);
    logger.info(`(takeover.reg.result) ${JSON.stringify(result)}`);

    // 최종 응답
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});
