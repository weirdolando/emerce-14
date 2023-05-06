const router = require("express").Router();
const { productController } = require("../controllers");
const userExtractor = require("../middleware/userExtractor");

router.get("/", productController.getProduct);
router.get("/total", productController.getTotalProduct);
router.get("/category", productController.getCategory);
router.get("/store", userExtractor, productController.getStoreProducts);
router.get(
  "/store/total",
  userExtractor,
  productController.getTotalStoreProducts
);
router.get("/:id", productController.getProductDetail);

router.post("/", productController.addProduct);
router.post("/category", productController.addCategory);

router.patch("/:id", productController.editProduct);

router.delete("/:id", productController.deactivateProduct);

module.exports = router;
