const router = require('express').Router();
const officerController = require('../controllers/officerController')

router.post('/new-officer',officerController.addOfficer);
router.post('/edit-officer',officerController.editOfficer);
router.post('/delete-officer',officerController.deleteOfficer);
router.post('/history',officerController.getOfficerHistory);

module.exports = router;