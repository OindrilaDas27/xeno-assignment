const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaign.controller');

router.post('/', campaignController.createNewCampaign);
router.get('/', campaignController.getAllCampaigns);
router.get('/:id', campaignController.getCampaignById);

module.exports = router;