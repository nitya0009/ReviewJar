// Run with: node seed.js
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Review = require("./models/Review");

dotenv.config();

const run = async () => {
  await connectDB();

  await Review.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();

  const admin = await User.create({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  });

  const products = await Product.insertMany([
    {
      name: "Wireless Headphones",
      description: "Over-ear headphones with noise cancellation and 30hr battery life.",
      category: "Electronics",
      price: 89.99,
      image: "https://placehold.co/400x300?text=Headphones",
      createdBy: admin._id,
    },
    {
      name: "Ceramic Coffee Mug",
      description: "12oz handmade ceramic mug, dishwasher and microwave safe.",
      category: "Home",
      price: 14.5,
      image: "https://placehold.co/400x300?text=Mug",
      createdBy: admin._id,
    },
    {
      name: "Running Shoes",
      description: "Lightweight running shoes with breathable mesh upper.",
      category: "Sportswear",
      price: 59.99,
      image: "https://placehold.co/400x300?text=Shoes",
      createdBy: admin._id,
    },
    {
      name: "Mechanical Keyboard",
      description: "Hot-swappable mechanical keyboard with RGB backlighting.",
      category: "Electronics",
      price: 74.0,
      image: "https://placehold.co/400x300?text=Keyboard",
      createdBy: admin._id,
    },
  ]);

  console.log("Seeded admin login: admin@example.com / admin123");
  console.log(`Seeded ${products.length} products`);
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
