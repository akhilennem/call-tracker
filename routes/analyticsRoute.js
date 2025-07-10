const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController')

router.post('/daily-volume',analyticsController.OfficerDailyCallVolume);
router.post('/monthly-volume',analyticsController.OfficerMonthlyCallVolume);// router.post('/delete-client',analyticsController.deleteClient);
router.post('/task-over-view',analyticsController.getTaskOverview);

module.exports = router;