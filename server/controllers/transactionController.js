const db = require("../config/db");

async function addTransactions(req, res) {
  const userId = req.user.id;
  if (!userId)
    return res.status(400).json({ error: "Required field cannot be empty" });
  const checkoutData = req.body;

  /**
   * Validate price in case the price on the server has changed,
   * and store the products for insertion into transaction details later
   */
  const products = [];
  let totalPrice = 0;
  try {
    for (product of checkoutData.carts) {
      const [productData] = await db
        .promise()
        .query(
          "SELECT id, store_id, product_name, price, description, price * ? AS total FROM products WHERE id = ?",
          [product.qty, product.id]
        );
      if (!productData.length)
        return res.status(404).json({ error: "Product not found" });
      const { id, store_id, product_name, price, description, total } =
        productData[0];
      products.push({
        product_id: id,
        store_id,
        qty: product.qty,
        product_name,
        product_price: price,
        product_description: description,
      });
      totalPrice += total;
    }
    if (totalPrice !== checkoutData.subtotal)
      return res.status(400).json({ error: "Price has changed" });

    // Create a new transaction
    await db.promise().query("START TRANSACTION");
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");
    await db
      .promise()
      .query(
        "INSERT INTO transactions (user_id, total, date) VALUES (?, ?, ?)",
        [userId, totalPrice, date]
      );
    const [transaction] = await db
      .promise()
      .query(
        "SELECT id FROM transactions WHERE user_id = ? AND total = ? AND date = ?",
        [userId, totalPrice, date]
      );
    const transactionId = transaction[0].id;

    // Create transaction details based on the products from server
    for (const product of products) {
      const {
        product_id,
        store_id,
        qty,
        product_name,
        product_price,
        product_description,
      } = product;
      await db
        .promise()
        .query(
          "INSERT INTO transaction_details (transaction_id, product_id, store_id, qty, product_name, product_price, product_description) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            transactionId,
            product_id,
            store_id,
            qty,
            product_name,
            product_price,
            product_description,
          ]
        );
      // Subtract stocks of the product and add sold product
      await db
        .promise()
        .query("UPDATE products SET stock = stock - ?, sold = sold + ?", [
          qty,
          qty,
        ]);
    }
    await db.promise().query("COMMIT");
    return res.status(201).json({ message: "Transaction successful" });
  } catch (err) {
    await db.promise().query("ROLLBACK");
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

module.exports = { addTransactions };
