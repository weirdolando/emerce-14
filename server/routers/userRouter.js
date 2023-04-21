const userRouter = require("express").Router();
const { userController } = require("../controllers");
const userExtractor = require("../middleware/userExtractor");

userRouter.post("/auth", userController.auth);
userRouter.post("/register", userController.register);
userRouter.get("/keeplogin", userExtractor, userController.keepLogin);

module.exports = userRouter;
