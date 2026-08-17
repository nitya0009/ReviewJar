const Product = require("../models/Product");
const Review = require("../models/Review");
const User = require("../models/User");

// @desc  Get products - supports search, category filter, sort, pagination
// @route GET /api/products?search=&category=&sort=&page=&limit=
const getProducts = async (req, res) => {
  const { search, category, sort } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 9);

  let filter = {};
  if (search) filter.name = { $regex: search, $options: "i" };
  if (category) filter.category = category;

  let sortOption = { createdAt: -1 }; // newest first (default)
  if (sort === "rating") sortOption = { avgRating: -1 };
  if (sort === "price-asc") sortOption = { price: 1 };
  if (sort === "price-desc") sortOption = { price: -1 };

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({
    products,
    page,
    pages: Math.ceil(total / limit) || 1,
    total,
  });
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

// Build the image path to store, preferring an uploaded file over a URL field
const resolveImage = (req) => {
  if (req.file) return `/uploads/${req.file.filename}`;
  return req.body.image || "";
};

const createProduct = async (req, res) => {
  const { name, description, category, price } = req.body;

  const product = new Product({
    name,
    description,
    category,
    price,
    image: resolveImage(req),
    createdBy: req.user._id,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const { name, description, category, price } = req.body;
  product.name = name ?? product.name;
  product.description = description ?? product.description;
  product.category = category ?? product.category;
  product.price = price ?? product.price;

  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
  } else if (req.body.image !== undefined) {
    product.image = req.body.image;
  }

  const updatedProduct = await product.save();
  res.json(updatedProduct);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await Review.deleteMany({ product: product._id });
  await product.deleteOne();
  res.json({ message: "Product removed" });
};

// @desc  Mock "purchase" - lets a logged in user unlock Verified Purchase badge
// @route POST /api/products/:id/purchase
const markAsPurchased = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user._id);
  const alreadyPurchased = user.purchasedProducts.some(
    (id) => id.toString() === product._id.toString()
  );

  if (!alreadyPurchased) {
    user.purchasedProducts.push(product._id);
    await user.save();
  }

  res.json({ message: "Marked as purchased (demo)", purchasedProducts: user.purchasedProducts });
};

// @desc  Toggle a product in the logged-in user's wishlist
// @route PUT /api/products/:id/wishlist
const toggleWishlist = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  const user = await User.findById(req.user._id);
  const index = user.wishlist.findIndex((id) => id.toString() === product._id.toString());

  let inWishlist;
  if (index === -1) {
    user.wishlist.push(product._id);
    inWishlist = true;
  } else {
    user.wishlist.splice(index, 1);
    inWishlist = false;
  }

  await user.save();
  res.json({ wishlist: user.wishlist, inWishlist });
};

// @desc  Get logged-in user's wishlist (populated products)
// @route GET /api/products/wishlist/mine
const getMyWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json(user.wishlist);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  markAsPurchased,
  toggleWishlist,
  getMyWishlist,
};
