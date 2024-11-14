const express = require('express');
const router = express.Router();
const segmentController = require('../controllers/segment.controller');
const { authenticateJwt } = require('../utils/auth')

router.post('/', authenticateJwt, segmentController.createSegment);
router.get('/', segmentController.getAllSegments);
router.get('/:id', segmentController.getSegmentById);

module.exports = router;