const db = require("../config/db");

async function getUserTransactions(req, res) {
  let dateStart = req.query.start;
  let dateEnd = req.query.end;
  const page = req.query.page || 1;
  if (!dateStart || !dateEnd) {
    const date = new Date();
    // Slice until 10 because I only need the date and not the timestamp.
    dateEnd = date.toISOString().slice(0, 10).replace("T", " ");
    date.setDate(date.getDate() - 7);
    dateStart = date.toISOString().slice(0, 10).replace("T", " ");
  }
  /**
   * Note: the timestamp is important, because if we only include the date,
   * e.g. 2023-05-04, it will consider it as 2023-05-04 00:00:00 which is
   * at midnight before that day even starts.
   * */
  dateStart += " 00:00:00";
  dateEnd += " 23:59:59";
  const userId = req.user.id;
  if (!userId)
    return res.status(400).json({ error: "Required field cannot be empty" });

  try {
    const [transactions] = await db.promise().query(
      `SELECT id, total, date
        FROM transactions
        WHERE user_id = ?
        AND date BETWEEN ? AND ?
        ORDER BY date DESC
        LIMIT 9 OFFSET ?`,
      [userId, dateStart, dateEnd, (page - 1) * 9]
    );
    for (const transaction of transactions) {
      const [products] = await db.promise().query(
        `SELECT td.product_name, td.product_price, p.image
          FROM transaction_details td
          JOIN products p
          ON td.product_id = p.id WHERE transaction_id = ?`,
        transaction.id
      );
      transaction.date = transaction.date
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
      transaction.products = products;
    }
    return res.status(200).json({ transactions });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function getTotalUserTransactions(req, res) {
  let dateStart = req.query.start;
  let dateEnd = req.query.end;
  if (!dateStart || !dateEnd) {
    const date = new Date();
    dateEnd = date.toISOString().slice(0, 10).replace("T", " ");
    date.setDate(date.getDate() - 7);
    dateStart = date.toISOString().slice(0, 10).replace("T", " ");
  }
  dateStart += " 00:00:00";
  dateEnd += " 23:59:59";
  const userId = req.user.id;
  try {
    const [transactions] = await db.promise().query(
      `SELECT COUNT(*) AS total_transactions
        FROM transactions
        WHERE user_id = ?
        AND date BETWEEN ? AND ?`,
      [userId, dateStart, dateEnd]
    );
    return res
      .status(200)
      .json({ total_transactions: transactions[0].total_transactions });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function getStoreTransactions(req, res) {
  let dateStart = req.query.start;
  let dateEnd = req.query.end;
  const page = req.query.page || 1;
  if (!dateStart || !dateEnd) {
    const date = new Date();
    // Slice until 10 because I only need the date and not the timestamp.
    dateEnd = date.toISOString().slice(0, 10).replace("T", " ");
    date.setDate(date.getDate() - 7);
    dateStart = date.toISOString().slice(0, 10).replace("T", " ");
  }
  /**
   * Note: the timestamp is important, because if we only include the date,
   * e.g. 2023-05-04, it will consider it as 2023-05-04 00:00:00 which is
   * at midnight before that day even starts.
   * */
  dateStart += " 00:00:00";
  dateEnd += " 23:59:59";
  const storeId = req.params.id;

  // * I remove pagination because I don't use it in frontend. Feel free to add if you need to
  // * Add LIMIT 9 OFFSET {(page - 1) * 9} to the query
  try {
    const [transactions] = await db.promise().query(
      `SELECT t.total
        FROM transaction_details td
        JOIN transactions t
        ON td.transaction_id = t.id
        WHERE td.store_id = ?
        AND t.date BETWEEN ? AND ?
        GROUP BY t.id
        ORDER BY date DESC`,
      [storeId, dateStart, dateEnd]
    );
    return res.status(200).json({ transactions });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

// * Just in case I changed my mind and want to use pagination
async function getTotalStoreTransactions(req, res) {
  let dateStart = req.query.start;
  let dateEnd = req.query.end;
  if (!dateStart || !dateEnd) {
    const date = new Date();
    dateEnd = date.toISOString().slice(0, 10).replace("T", " ");
    date.setDate(date.getDate() - 7);
    dateStart = date.toISOString().slice(0, 10).replace("T", " ");
  }
  dateStart += " 00:00:00";
  dateEnd += " 23:59:59";
  const storeId = req.params.id;

  try {
    const [transactions] = await db.promise().query(
      `SELECT t.id
        FROM transaction_details td
        JOIN transactions t
        ON td.transaction_id = t.id
        WHERE td.store_id = ?
        AND t.date BETWEEN ? AND ?
        GROUP BY t.id`,
      [storeId, dateStart, dateEnd]
    );
    return res.status(200).json({ total_transactions: transactions.length });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

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

module.exports = {
  getUserTransactions,
  getTotalUserTransactions,
  getStoreTransactions,
  getTotalStoreTransactions,
  addTransactions,
};
