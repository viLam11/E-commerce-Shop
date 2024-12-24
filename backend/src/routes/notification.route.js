const express = require('express');
const router = express.Router();
const notificationController = require('../controller/notification.Controller');
const authMiddleware = require('../middleware/authMiddleware.js');

router.post     ('/create', notificationController.CreateNotification);// chỉ dành cho admin
router.get      ('/get',notificationController.GetNotification); // id là của user
router.put      ('/update', notificationController.UpdateNotification);
router.delete   ('/delete', notificationController.DeleteNotification);

module.exports = router;