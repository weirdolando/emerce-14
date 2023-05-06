const db = require("../config/db.js");

module.exports = {
  //todo: where user_id = ... and stock > 0 and is_active = 1
  getProduct: (req, res) => {
    var page = req.query.page;
    if (req.query.page == null) {
      page = 1;
    }

    var orderBy = "";
    if (
      req.query.sort != null ||
      req.query.top != null ||
      req.query.price != null
    ) {
      orderBy = "order by ";
    }

    var sort = "";
    if (req.query.sort == "asc") {
      sort = "product_name asc ";
    } else if (req.query.sort == "desc") {
      sort = "product_name desc ";
    }

    var price = "";
    var sep1 = "";
    if (sort != "") {
      sep1 = ", ";
    }
    if (req.query.price == "asc") {
      price = sep1 + "price asc ";
    } else if (req.query.price == "desc") {
      price = sep1 + "price desc ";
    }

    var where = "";
    if (req.query.category_id != null || req.query.name != null) {
      where = "where ";
    }

    var name = "";
    if (req.query.name != null) {
      name = `product_name like '%${req.query.name}%' `;
    }

    var and = "";
    if (req.query.category_id != null && req.query.name != null) {
      and = "and ";
    }

    var category_id = "";
    if (req.query.category_id != null) {
      category_id = `category_id = '${req.query.category_id}' `;
    }

    db.query(
      `select * from products ${where}${name}${and}${category_id}${orderBy}${sort}${price}limit 9 offset ${
        (page - 1) * 9
      }`,
      (err, result) => {
        if (err) return res.status(400).send(err);
        res.send({
          status: 200,
          data: result,
        });
      }
    );
  },

  getCategory: (req, res) => {
    db.query(`select * from categories`, (err, result) => {
      if (err) return res.status(400).send(err);
      res.send({
        status: 200,
        data: result,
      });
    });
  },

  getTotalProduct: (req, res) => {
    var where = "";
    if (req.query.category_id != null || req.query.name != null) {
      where = "where ";
    }

    var name = "";
    if (req.query.name != null) {
      name = `product_name like '%${req.query.name}%' `;
    }

    var and = "";
    if (req.query.category_id != null && req.query.name != null) {
      and = "and ";
    }

    var category_id = "";
    if (req.query.category_id != null) {
      category_id = `category_id = '${req.query.category_id}' `;
    }

    db.query(
      `select count(*) as total_products from products ${where}${name}${and}${category_id}`,
      (err, result) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          total_products: result[0].total_products,
        });
      }
    );
  },
  async getStoreProducts(req, res) {
    const page = req.query.page || 1;
    const categoryId = req.query.categoryId;
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({ error: "Required field cannot be empty" });
    try {
      const [store] = await db
        .promise()
        .query("SELECT id FROM stores WHERE user_id = ?", userId);
      if (!store.length)
        return res.status(404).json({ error: "Store not found" });
      const storeId = store[0].id;
      if (categoryId) {
        const [products] = await db
          .promise()
          .query(
            "SELECT * FROM products WHERE store_id = ? AND category_id = ? ORDER BY sold DESC LIMIT 9 OFFSET ?",
            [storeId, categoryId, (page - 1) * 9]
          );
        return res.status(200).json({ status: 200, data: products });
      }
      const [products] = await db
        .promise()
        .query(
          "SELECT * FROM products WHERE store_id = ? ORDER BY sold DESC LIMIT 9 OFFSET ?",
          [storeId, (page - 1) * 9]
        );
      return res.status(200).json({ status: 200, data: products });
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: err.message });
    }
  },
  async getTotalStoreProducts(req, res) {
    const categoryId = req.query.categoryId;
    const userId = req.user.id;
    if (!userId)
      return res.status(400).json({ error: "Required field cannot be empty" });
    try {
      const [store] = await db
        .promise()
        .query("SELECT id FROM stores WHERE user_id = ?", userId);
      if (!store.length)
        return res.status(404).json({ error: "Store not found" });
      const storeId = store[0].id;
      if (categoryId) {
        const [products] = await db
          .promise()
          .query(
            "SELECT COUNT(*) AS total_products FROM products WHERE store_id = ? AND category_id = ?",
            [storeId, categoryId]
          );
        return res
          .status(200)
          .json({ status: 200, total_products: products[0].total_products });
      }
      const [products] = await db
        .promise()
        .query(
          "SELECT COUNT(*) AS total_products FROM products WHERE store_id = ?",
          storeId
        );
      return res
        .status(200)
        .json({ status: 200, total_products: products[0].total_products });
    } catch (err) {
      console.log(err.message);
      return res.status(400).json({ error: err.message });
    }
  },
  getProductDetail: (req, res) => {
    db.query(
      `select * from products where id = ${req.params.id}`,
      (err, result) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          data: result[0],
        });
      }
    );
  },

  getCategoryDetail: (req, res) => {
    db.query(
      `select * from categories where id = ${req.params.id}`,
      (err, result) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          data: result[0],
        });
      }
    );
  },

  addProduct: (req, res) => {
    const {
      store_id,
      category_id,
      product_name,
      price,
      image,
      description,
      stock,
    } = req.body;
    db.query(
      `insert into products(store_id, category_id, product_name, price, image, description, stock, is_active, sold) values
            (${db.escape(store_id)}, ${db.escape(category_id)}, ${db.escape(
        product_name
      )}, ${db.escape(price)}, ${db.escape(image)}, ${db.escape(
        description
      )},  ${db.escape(stock)}, 1, 0);`,
      (err) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          message: "Product added",
        });
      }
    );
  },

  addCategory: (req, res) => {
    const { category_name } = req.body;
    db.query(
      `insert into categories(category) values
            (${db.escape(category_name)});`,
      (err) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          message: "Category added",
        });
      }
    );
  },

  editProduct: (req, res) => {
    db.query(
      `update products set ? where id = ?`,
      [req.body, req.params.id],
      (err) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          message: "Product updated",
        });
      }
    );
  },

  editCategory: (req, res) => {
    db.query(
      `update categories set ? where id = ?`,
      [req.body, req.params.id],
      (err) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          message: "Category updated",
        });
      }
    );
  },

  deactivateProduct: (req, res) => {
    db.query(
      `update products set is_active = 0 where id = ${req.params.id}`,
      (err) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          message: "Product deactivated",
        });
      }
    );
  },
};
