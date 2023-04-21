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
    if (req.query.category != null || req.query.name != null) {
      where = "where ";
    }

    var name = "";
    if (req.query.name != null) {
      name = `product_name like '%${req.query.name}%' `;
    }

    var and = "";
    if (req.query.category != null && req.query.name != null) {
      and = "and ";
    }

    var category = "";
    if (req.query.category != null) {
      category = `category = '${req.query.category}' `;
    }

    db.query(
      `select * from products ${where}${name}${and}${category}${orderBy}${sort}${price}limit 9 offset ${
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

  getTotalProduct: (req, res) => {
    var where = "";
    if (req.query.category != null || req.query.name != null) {
      where = "where ";
    }

    var name = "";
    if (req.query.name != null) {
      name = `product_name like '%${req.query.name}%' `;
    }

    var and = "";
    if (req.query.category != null && req.query.name != null) {
      and = "and ";
    }

    var category = "";
    if (req.query.category != null) {
      category = `category = '${req.query.category}' `;
    }

    db.query(
      `select count(*) as total_products from products ${where}${name}${and}${category}`,
      (err, result) => {
        if (err) res.status(400).send(err);
        res.send({
          status: 200,
          total_products: result[0].total_products,
        });
      }
    );
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
