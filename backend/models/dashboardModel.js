const db = require("../config/db");

/**
 * Total Sales
 */
const getTotalSales = async () => {
  const result = await db.query(`
    SELECT COALESCE(SUM(total_amount), 0) AS total_sales
    FROM sales
  `);

  return result.rows[0];
};

/*** Profit Summary*/
const getProfitSummary = async () => {
  const result = await db.query(`
    SELECT
      COALESCE(
        SUM(si.price * si.quantity),
        0
      ) AS total_sales,

      COALESCE(
        SUM(
          (si.price - p.cost_price)
          * si.quantity
        ),
        0
      ) AS estimated_profit

    FROM sale_items si
    JOIN products p
      ON si.product_id = p.product_id
  `);

  return result.rows[0];
};

/*** Total Products*/

const getTotalProducts = async () => {
  const result = await db.query(`
    SELECT COUNT(*) AS total_products
    FROM products
  `);

  return result.rows[0];
};

/**
 * Low Stock Products
 */
const getLowStockProducts = async () => {
  const result = await db.query(`
    SELECT *
    FROM products
    WHERE quantity <= 5
    ORDER BY quantity ASC
  `);

  return result.rows;
};

module.exports = {
  getTotalSales,
  getTotalProducts,
  getLowStockProducts,
  getProfitSummary
};