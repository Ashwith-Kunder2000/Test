const router = require('express').Router();
const controller = require('../controllers/notification.controller');

router.post('/schedule', controller.scheduleEmail);
router.post('/cancel', controller.cancelNotification);
router.get('/', controller.getNotifications);

module.exports = router;