const router = require('express').Router();
const officerController = require('../controllers/officerController')

router.post('/new-officer',officerController.addOfficer);
router.put('/edit-officer',officerController.editOfficer);
router.delete('/delete-officer',officerController.deleteOfficer);
router.get('/history',officerController.getOfficerHistory);

module.exports = router;