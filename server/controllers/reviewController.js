const Review = require("../models/Review");
const Product = require("../models/Product");
const User = require("../models/User");

const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const avgRating =
    numReviews === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

  await Product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews,
  });
};

const getReviewsForProduct = async (req, res) => {
  const { sort } = req.query;
  let sortOption = { createdAt: -1 };

  if (sort === "rating") sortOption = { rating: -1 };
  if (sort === "helpful") sortOption = { helpfulVotes: -1 };

  const reviews = await Review.find({ product: req.params.productId })
    .populate("user", "name")
    .sort(sortOption);

  res.json(reviews);
};

const createReview = async (req, res) => {
  const { rating, text } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) {
    return res.status(400).json({ message: "You already reviewed this product" });
  }

  const user = await User.findById(req.user._id);
  const verifiedPurchase = user.purchasedProducts.some(
    (id) => id.toString() === productId
  );

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating,
    text,
    image: req.file ? `/uploads/${req.file.filename}` : "",
    verifiedPurchase,
  });

  await recalcProductRating(productId);

  const populatedReview = await review.populate("user", "name");
  res.status(201).json(populatedReview);
};

const updateReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  if (review.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not authorized to edit this review" });
  }

  const { rating, text } = req.body;
  review.rating = rating ?? review.rating;
  review.text = text ?? review.text;
  if (req.file) review.image = `/uploads/${req.file.filename}`;

  const updatedReview = await review.save();
  await recalcProductRating(review.product);

  res.json(updatedReview);
};

const deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  const isOwner = review.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "Not authorized to delete this review" });
  }

  const productId = review.product;
  await review.deleteOne();
  await recalcProductRating(productId);

  res.json({ message: "Review removed" });
};

const toggleHelpful = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });

  const userId = req.user._id.toString();
  const alreadyVoted = review.votedBy.some((id) => id.toString() === userId);

  if (alreadyVoted) {
    review.votedBy = review.votedBy.filter((id) => id.toString() !== userId);
    review.helpfulVotes = Math.max(0, review.helpfulVotes - 1);
  } else {
    review.votedBy.push(req.user._id);
    review.helpfulVotes += 1;
  }

  await review.save();
  res.json(review);
};

module.exports = {
  getReviewsForProduct,
  createReview,
  updateReview,
  deleteReview,
  toggleHelpful,
};
