const userRouter = require("express").Router();
const { userController } = require("../controllers");

userRouter.post("/auth", userController.auth);
userRouter.post("/register", userController.register);

module.exports = userRouter;
