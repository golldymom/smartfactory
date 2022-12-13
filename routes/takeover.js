const express = require('express');

const router = express.Router();
const logger = require('../lib/logger');
const middleware = require('../lib/middleware');
const { sequelize } = require('../models/index');
// const { verifyToken } = require('../lib/tokenUtil');
const takeoverService = require('../service/takeoverService');

// 등록
router.post('/:userid', middleware.isLoggedIn, async (req, res) => {
  try {
    const params = {
      // departmentId: req.body.departmentId,
      takeoverDate: req.body.takeoverDate,
      tTitle: req.body.tTitle,
      tContents: req.body.tContents,
      tName: req.body.tName,
      companyId: req.params.userid,
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

// 리스트 조회
router.get('/list:page', async (req, res) => {
  try {
    // 최종 응답
    const result = await sequelize.query('SELECT * from takeovers limit 5');
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: err.toString() });
  }
});

// // 상세정보 조회
// router.get('/:id', async (req, res) => {
//   try {
//     const params = {
//       id: req.params.id,
//     };
//     logger.info(`(user.info.params) ${JSON.stringify(params)}`);

//     const result = await takeoverService.info(params);
//     logger.info(`(user.info.result) ${JSON.stringify(result)}`);

//     // 최종 응답
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ err: err.toString() });
//   }
// });

// // 수정
// router.put('/:id', async (req, res) => {
//   try {
//     const params = {
//       id: req.params.id,
//       // departmentId: req.body.departmentId,
//       factoryname: req.body.factoryname,
//       ceoname: req.body.ceoname,
//       // role: req.body.role,
//       email: req.body.email,
//       phone: req.body.phone,
//     };
//     logger.info(`(user.update.params) ${JSON.stringify(params)}`);

//     // 입력값 null 체크
//     if (!params.ceoname) {
//       const err = new Error('Not allowed null (ceoname)');
//       logger.error(err.toString());

//       res.status(500).json({ err: err.toString() });
//     }

//     const result = await takeoverService.edit(params);
//     logger.info(`(user.update.result) ${JSON.stringify(result)}`);

//     // 최종 응답
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ err: err.toString() });
//   }
// });

// // 삭제
// router.delete('/:id', async (req, res) => {
//   try {
//     const params = {
//       id: req.params.id,
//     };
//     logger.info(`(user.delete.params) ${JSON.stringify(params)}`);

//     const result = await takeoverService.delete(params);
//     logger.info(`(user.delete.result) ${JSON.stringify(result)}`);

//     // 최종 응답
//     res.status(200).json(result);
//   } catch (err) {
//     res.status(500).json({ err: err.toString() });
//   }
// });

module.exports = router;
