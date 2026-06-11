const db = require('../config/db');

/*** Create product*/
const createProduct = async (
    name,
    price,
    cost_price,
    quantity
) => {
    const result = await db.query(
        `
        INSERT INTO products
        (
            name,
            price,
            cost_price,
            quantity
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *;
        `,
        [name, price, cost_price, quantity]
    );

    return result.rows[0];
};

/*** Get all products*/
const getAllProducts = async () => {
    const result = await db.query(
        `SELECT * FROM products ORDER BY product_id DESC`
    );

    return result.rows;
};

/*** Get single product*/
const getProductById = async (id) => {
    const result = await db.query(
        `SELECT * FROM products WHERE product_id = $1`,
        [id]
    );

    return result.rows[0];
};

const searchProducts = async (keyword) => {
    const result = await db.query(
        `
        SELECT *
        FROM products
        WHERE LOWER(name)
        LIKE LOWER($1)
        ORDER BY name ASC
        `,
        [`%${keyword}%`]
    );

    return result.rows;
};

/*** Update product*/
const updateProduct = async (
    id,
    name,
    price,
    cost_price,
    quantity
) => {
    const result = await db.query(
        `
        UPDATE products
        SET
            name = $1,
            price = $2,
            cost_price = $3,
            quantity = $4
        WHERE product_id = $5
        RETURNING *;
        `,
        [name, price, cost_price, quantity, id]
    );

    return result.rows[0];
};

/*** Delete product*/
const deleteProduct = async (id) => {
    await db.query(
        `DELETE FROM products WHERE product_id = $1`,
        [id]
    );
};

const updateProductStock = async (product_id, quantity_sold) => {
  const result = await db.query(
    `
    UPDATE products
    SET quantity = quantity - $1
    WHERE product_id = $2
    RETURNING *;
    `,
    [quantity_sold, product_id]
  );

  return result.rows[0];
};

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
   createProduct,
   getAllProducts,
   getProductById,
   updateProduct,
   deleteProduct,
   updateProductStock,
   searchProducts,
   getLowStockProducts
};