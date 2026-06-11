const salesModel = require('../models/salesModel');

/**
 * CREATE SALE
 */
const createSale = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const sale = await salesModel.processSale(
      product_id,
      quantity
    );

    res.status(201).json({
      success: true,
      message: "Sale completed",
      sale
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

/**
 * SALES REPORT
 */
const getSalesReport = async (req, res) => {
  try {

    const report =
      await salesModel.getSalesReport();

    res.status(200).json({
      success: true,
      report
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/**
 * GET ALL SALES
 */
const getSales = async (req, res) => {
  try {

    const sales =
      await salesModel.getAllSales();

    res.status(200).json({
      success: true,
      sales
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch sales"
    });

  }
};

/**
 * GET RECEIPT
 */
const getReceipt = async (req, res) => {
  try {

    const receipt =
      await salesModel.getReceiptBySaleId(
        req.params.id
      );

    if (!receipt.length) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found"
      });
    }

    res.status(200).json({
      success: true,
      receipt
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  createSale,
  getSales,
  getSalesReport,
  getReceipt
};