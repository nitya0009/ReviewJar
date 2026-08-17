const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsPurchased,
  toggleWishlist,
  getMyWishlist,
} = require("../controllers/productController");
const {
  getReviewsForProduct,
  createReview,
} = require("../controllers/reviewController");
const { protect, admin } = require("../middleware/auth");
const upload = require("../middleware/upload");

// IMPORTANT: specific routes before /:id
router.get("/wishlist/mine", protect, getMyWishlist);

router.get("/", getProducts);
router.post("/", protect, admin, upload.single("image"), createProduct);
router.get("/:id", getProductById);
router.put("/:id", protect, admin, upload.single("image"), updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

router.post("/:id/purchase", protect, markAsPurchased);
router.put("/:id/wishlist", protect, toggleWishlist);

router.get("/:productId/reviews", getReviewsForProduct);
router.post("/:productId/reviews", protect, upload.single("image"), createReview);

module.exports = router;
