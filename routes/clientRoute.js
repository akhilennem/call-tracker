const router = require('express').Router();
const ClientController = require('../controllers/clientController')

router.post('/new-client',ClientController.addClient);
router.post('/edit-client',ClientController.editClient);
router.post('/delete-client',ClientController.deleteClient);
router.post('/history',ClientController.getClientHistory);

module.exports = router;