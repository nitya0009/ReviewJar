const express = require("express");
const router = express.Router();
const {
  updateReview,
  deleteReview,
  toggleHelpful,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.put("/:id", protect, upload.single("image"), updateReview);
router.delete("/:id", protect, deleteReview);
router.put("/:id/helpful", protect, toggleHelpful);

module.exports = router;
