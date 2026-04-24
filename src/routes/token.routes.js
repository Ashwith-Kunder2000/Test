const router = require('express').Router();
const controller = require('../controllers/token.controller');

router.post('/create', controller.createToken);
router.post('/approve', controller.approveToken);

module.exports = router;