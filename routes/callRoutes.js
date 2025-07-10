const router = require('express').Router();
const callController = require('../controllers/callController')


// router.post('/new-call',callController.LogCall);
router.put('/edit-call',callController.editLog);
router.delete('/delete-call',callController.deleteLog);
router.get('/get-call-by-id',callController.findLogByID);

module.exports = router;