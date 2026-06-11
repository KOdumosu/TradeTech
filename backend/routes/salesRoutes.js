const express = require('express');
const router = express.Router();

const {
    createSale,
    getSales,
    getSalesReport,
    getReceipt
} = require('../controllers/salesController');


const authMiddleware = require('../middleware/authMiddleware');

/*** Create Sale*/
router.post(
    '/',
    authMiddleware,
    createSale
);

/*** Get All Sales*/
router.get(
    '/',
    authMiddleware,
    getSales
);

/*** Sales Report*/
router.get(
    '/report',
    authMiddleware,
    getSalesReport
);

/*** Receipt by Sale ID*/
router.get(
    '/:id/receipt',
    authMiddleware,
    getReceipt
);

module.exports = router;