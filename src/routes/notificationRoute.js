const router = require('express').Router();
const controller = require('../controllers/notificationController');
 
router.post('/create', controller.createNotification);
router.patch('/cancel', controller.cancelNotification);
 
module.exports = router;