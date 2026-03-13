require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
const Category = require('./models/Category');

dns.setServers(['8.8.8.8', '8.8.4.4']);

const categories = [
  { name: 'Breakfast', slug: 'breakfast', description: 'Morning meals and brunch recipes' },
  { name: 'Lunch', slug: 'lunch', description: 'Midday meals and light dishes' },
  { name: 'Dinner', slug: 'dinner', description: 'Evening meals and hearty dishes' },
  { name: 'Desserts', slug: 'desserts', description: 'Sweet treats and baked goods' },
  { name: 'Snacks', slug: 'snacks', description: 'Quick bites and appetizers' },
  { name: 'Beverages', slug: 'beverages', description: 'Drinks, smoothies and juices' },
  { name: 'Vegetarian', slug: 'vegetarian', description: 'Meat-free recipes' },
  { name: 'Seafood', slug: 'seafood', description: 'Fish and seafood dishes' },
  { name: 'Soups & Stews', slug: 'soups-stews', description: 'Warm and comforting soups' },
  { name: 'Salads', slug: 'salads', description: 'Fresh and healthy salads' },
  { name: 'Italian', slug: 'italian', description: 'Classic Italian dishes' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await Category.countDocuments();
  if (existing > 0) {
    console.log(`${existing} categories already exist. Skipping seed.`);
    process.exit(0);
  }

  await Category.insertMany(categories);
  console.log(`✅ Seeded ${categories.length} categories`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
