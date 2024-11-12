const express = require("express");
const authController = require("../controllers/auth");

const router = express.Router();

// Route to render the login page (GET)
router.get("/login", (req, res) => {
  console.log("Login route accessed");
  res.render("login"); // Render the login view (update if your view path is different)
});
router.post("/login", authController.login);

router.get("/register", (req, res) => {
  console.log("Register route accessed");
  res.render("register"); // Render the register view (update if your view path is different)
});
router.post("/register", authController.register);


router.use(authController.isLoggedIn);
router.get("/profile", authController.profile);
router.post("/update-profile", authController.updateProfile);
router.get("/logout", authController.logout);
router.use(authController.isAdmin);

module.exports = router;
