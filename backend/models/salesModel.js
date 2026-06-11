const db = require('../config/db');
const { updateProductStock } = require('./products');

/*** Create Sale*/
const createSale = async (total_amount) => {
    const result = await db.query(
        `
        INSERT INTO sales (total_amount)
        VALUES ($1)
        RETURNING *;
        `,
        [total_amount]
    );

    return result.rows[0];
};

/*** Add Sale Item*/
const addSaleItem = async (
    sale_id,
    product_id,
    quantity,
    price
) => {
    const result = await db.query(
        `
        INSERT INTO sale_items
        (
            sale_id,
            product_id,
            quantity,
            price
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,
        [sale_id, product_id, quantity, price]
    );

    return result.rows[0];
};

/**
 * Complete Sale
 */
const processSale = async (
    product_id,
    quantity
) => {

    const productResult = await db.query(
        `
        SELECT *
        FROM products
        WHERE product_id = $1
        `,
        [product_id]
    );

    const product = productResult.rows[0];

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.quantity < quantity) {
        throw new Error("Insufficient stock");
    }

    const totalAmount =
        Number(product.price) * Number(quantity);

    const sale = await createSale(totalAmount);

    await addSaleItem(
        sale.sale_id,
        product.product_id,
        quantity,
        product.price
    );

    await updateProductStock(
        product.product_id,
        quantity
    );

    return sale;
};

/*** Get all sales*/
const getAllSales = async () => {
    const result = await db.query(`
        SELECT *
        FROM sales
        ORDER BY created_at DESC;
    `);

    return result.rows;
};

const getSalesReport = async () => {
  const result = await db.query(`
    SELECT
      COUNT(*) AS total_transactions,
      COALESCE(SUM(total_amount),0) AS total_sales,
      COALESCE(AVG(total_amount),0) AS average_sale
    FROM sales
  `);

  return result.rows[0];
};

const getProfitAnalytics = async () => {

    const result = await db.query(`
        SELECT
            COALESCE(
                SUM(
                    (si.price - p.cost_price)
                    * si.quantity
                ),
                0
            ) AS estimated_profit,

            COALESCE(
                SUM(
                    si.price * si.quantity
                ),
                0
            ) AS total_sales

        FROM sale_items si
        JOIN products p
            ON si.product_id = p.product_id;
    `);

    return result.rows[0];
};

/**
 * Get Receipt By Sale ID
 */
const getReceiptBySaleId = async (saleId) => {
    const result = await db.query(
        `
        SELECT
            s.sale_id,
            s.created_at,
            p.name AS product_name,
            si.quantity,
            si.price,
            (si.quantity * si.price) AS total
        FROM sales s
        JOIN sale_items si
            ON s.sale_id = si.sale_id
        JOIN products p
            ON si.product_id = p.product_id
        WHERE s.sale_id = $1
        `,
        [saleId]
    );

    return result.rows;
};


module.exports = {
    createSale,
    addSaleItem,
    processSale,
    getAllSales,
    getSalesReport,
    getProfitAnalytics,
    getReceiptBySaleId
};