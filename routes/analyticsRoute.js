const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController')

router.get('/daily-volume',analyticsController.OfficerDailyCallVolume);
router.get('/monthly-volume',analyticsController.OfficerMonthlyCallVolume);// router.post('/delete-client',analyticsController.deleteClient);
router.get('/task-over-view',analyticsController.getTaskOverview);

module.exports = router;