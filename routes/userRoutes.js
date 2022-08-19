const Router = require("express");
const {
  registerUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controller/usersController");

const { protect } = require("../middleware/authMiddleware");

const router = Router();
router.get("/get-user", protect, getUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", protect, updateUser);
router.delete("/delete", protect, deleteUser);

module.exports = router;
