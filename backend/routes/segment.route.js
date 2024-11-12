const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segment.controller');

router.post('/', segmentController.createSegment);

module.exports = router;