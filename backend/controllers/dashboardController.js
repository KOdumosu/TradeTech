const dashboardModel = require("../models/dashboardModel");

const getDashboard = async (req, res) => {
  try {

    const totalSales =
      await dashboardModel.getTotalSales();

    const totalProducts =
      await dashboardModel.getTotalProducts();

    const lowStockProducts =
      await dashboardModel.getLowStockProducts();

      const profitSummary =
  await dashboardModel.getProfitSummary();

  res.status(200).json({
  success: true,
  dashboard: {
    totalSales,
    totalProducts,
    lowStockProducts,
    profitSummary
  }
});
   
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



module.exports = {
  getDashboard
};