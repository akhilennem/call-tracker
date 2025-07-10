const router = require('express').Router();
const callController = require('../controllers/callController')


// router.post('/new-call',callController.LogCall);
router.post('/edit-call',callController.editLog);
router.post('/delete-call',callController.deleteLog);
router.post('/get-call-by-id',callController.findLogByID);

module.exports = router;