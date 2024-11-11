const express = require('express');
const router = express.Router();

const customerController = require('../controllers/customer.controller');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
router.get('/:id', customerController.getCustomerId);

module.exports = router;