const express = require('express');
const router = express.Router();
const { getDashboardChartData } = require('../controllers/dashboardChart');

// المسار المتوافق مع STATS_API_URL بالفرونت أند
router.get('/dashboard-stats', getDashboardChartData);

module.exports = router;