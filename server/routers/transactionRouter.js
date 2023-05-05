const router = require("express").Router();
const { transactionController } = require("../controllers");

router.post("/", transactionController.addTransactions);
router.get("/user/", transactionController.getUserTransactions);
router.get("/user/total", transactionController.getTotalUserTransactions);

module.exports = router;
