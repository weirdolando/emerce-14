const db = require("../config/db");

async function getCartProduct(req, res) {
  const userId = req.user.id;
  if (!userId)
    return res.status(400).json({ error: "Required field cannot be empty" });
  try {
    const [products] = await db.promise().query(
      `SELECT p.id, p.product_name, p.price, p.image, ci.qty
       FROM users u
       JOIN carts c
       ON u.id = c.user_id
       JOIN cart_items ci
       ON c.id = ci.cart_id
       JOIN products p
       ON ci.product_id = p.id
       WHERE u.id = ?`,
      userId
    );
    res.status(200).json({ data: products });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({ error: err.message });
  }
}

async function addCartProduct(req, res) {
  const userId = req.user.id;
  const productId = req.body.id;
  if (!userId || !productId)
    return res.status(400).json({ error: "Required field cannot be empty" });

  try {
    const [userCart] = await db
      .promise()
      .query(
        "SELECT c.id FROM carts c JOIN users u WHERE c.user_id = ? LIMIT 1",
        userId
      );
    const userCartId = userCart[0].id;
    const [productInCart] = await db
      .promise()
      .query(
        "SELECT product_id FROM cart_items WHERE cart_id = ? AND product_id = ?",
        [userCartId, productId]
      );
    // If product already exists in cart, add qty instead
    if (productInCart.length) {
      const [qty] = await db
        .promise()
        .query(
          "SELECT qty FROM cart_items WHERE product_id = ? AND cart_id = ?",
          [productId, userCartId]
        );
      const newQty = qty[0].qty + 1;
      await db
        .promise()
        .query(
          "UPDATE cart_items SET qty = ? WHERE product_id = ? AND cart_id = ?",
          [newQty, productId, userCartId]
        );
      return res
        .status(200)
        .json({ message: "Success added to cart", productId });
    }

    await db
      .promise()
      .query(
        "INSERT INTO cart_items (cart_id, product_id, qty) VALUES (?, ?, 1)",
        [userCartId, productId]
      );
    return res
      .status(201)
      .json({ message: "Success added to cart", productId });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function editCartProduct(req, res) {
  const userId = req.user.id;
  const productId = req.body.id;
  const qty = req.body.qty;
  if (!userId || !productId || !qty)
    return res.status(400).json({ error: "Required field cannot be empty" });

  try {
    const [userCart] = await db
      .promise()
      .query(
        "SELECT c.id FROM carts c JOIN users u WHERE c.user_id = ? LIMIT 1",
        userId
      );
    const userCartId = userCart[0].id;
    const [productInCart] = await db
      .promise()
      .query(
        "SELECT product_id FROM cart_items WHERE cart_id = ? AND product_id = ?",
        [userCartId, productId]
      );
    // If product doesn't exist
    if (!productInCart.length)
      return res.status(404).json({ message: "Product doesn't exist" });

    await db
      .promise()
      .query(
        "UPDATE cart_items SET qty = ? WHERE product_id = ? AND cart_id = ?",
        [qty, productId, userCartId]
      );
    return res.status(200).json({ message: "Cart updated" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

async function deleteCartProduct(req, res) {
  const userId = req.user.id;
  const productId = req.body.id;
  if (!userId || !productId)
    return res.status(400).json({ error: "Required field cannot be empty" });

  try {
    const [userCart] = await db
      .promise()
      .query(
        "SELECT c.id FROM carts c JOIN users u WHERE c.user_id = ? LIMIT 1",
        userId
      );
    const userCartId = userCart[0].id;

    await db
      .promise()
      .query("DELETE FROM cart_items WHERE product_id = ? AND cart_id = ?", [
        productId,
        userCartId,
      ]);
    return res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getCartProduct,
  addCartProduct,
  editCartProduct,
  deleteCartProduct,
};
