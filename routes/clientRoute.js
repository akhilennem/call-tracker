const router = require('express').Router();
const ClientController = require('../controllers/clientController')

router.post('/new-client',ClientController.addClient);
router.put('/edit-client',ClientController.editClient);
router.delete('/delete-client',ClientController.deleteClient);
router.get('/history',ClientController.getClientHistory);

module.exports = router;