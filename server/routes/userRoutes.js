const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", userController.getAllUsers); // Public route
router.post("/register", userController.register); // Public route
router.post("/login", userController.login); // Public route
router.get("/profile", authMiddleware, userController.getUserProfile); // Protected route
router.put("/update-email", authMiddleware, userController.updateEmail); // Protected route
router.put("/update-password", authMiddleware, userController.updatePassword); // Protected route

module.exports = router;
