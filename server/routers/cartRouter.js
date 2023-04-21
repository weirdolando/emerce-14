const cartRouter = require("express").Router();
const { cartController } = require("../controllers");

cartRouter.get("/products/", cartController.getCartProduct);
cartRouter.post("/products/", cartController.addCartProduct);
cartRouter.patch("/products/", cartController.editCartProduct);
cartRouter.delete("/products/", cartController.deleteCartProduct);

module.exports = cartRouter;
