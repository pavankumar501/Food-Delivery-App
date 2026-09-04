const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const Category = require('./models/Category');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await MenuItem.deleteMany({});
  await Category.deleteMany({});

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await User.create({
    name: 'Admin', email: 'admin@foodie.com', password: hashedPassword,
    phone: '9876543210', role: 'admin',
    address: { street: 'MG Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
  });

  const customerPass = await bcrypt.hash('customer123', 10);
  await User.create({
    name: 'John Doe', email: 'john@example.com', password: customerPass,
    phone: '9876543211', role: 'customer',
    address: { street: '123 Main St', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }
  });

  const categories = await Category.insertMany([
    { name: 'Biryani', icon: '🍚' },
    { name: 'Pizza', icon: '🍕' },
    { name: 'Dosa', icon: '🫓' },
    { name: 'Chinese', icon: '🥡' },
    { name: 'Burger', icon: '🍔' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Tandoori', icon: '🍗' },
    { name: 'South Indian', icon: '🍛' },
    { name: 'Street Food', icon: '🌮' },
    { name: 'Desserts', icon: '🍰' },
    { name: 'Rolls', icon: '🌯' },
    { name: 'Thali', icon: '🍽️' }
  ]);

  const restaurantsData = [
    {
      name: 'Biryani House', slug: 'biryani-house',
      cuisine: ['Biryani', 'Mughlai', 'Hyderabadi'],
      rating: 4.5, reviewCount: 1234, deliveryTime: '25-35 min',
      minOrder: 149, isOpen: true,
      address: '45 Charminar Road, Hyderabad', phone: '9876543001',
      offers: ['60% off up to ₹120', 'Free delivery on orders above ₹299']
    },
    {
      name: 'Pizza Corner', slug: 'pizza-corner',
      cuisine: ['Pizza', 'Italian', 'Pasta'],
      rating: 4.3, reviewCount: 890, deliveryTime: '30-40 min',
      minOrder: 199, isOpen: true,
      address: '78 Brigade Road, Bangalore', phone: '9876543002',
      offers: ['Buy 1 Get 1 Free', '20% off on first order']
    },
    {
      name: 'Dosa Factory', slug: 'dosa-factory',
      cuisine: ['Dosa', 'South Indian', 'Idli'],
      rating: 4.4, reviewCount: 1567, deliveryTime: '20-30 min',
      minOrder: 99, isOpen: true,
      address: '23 Anna Salai, Chennai', phone: '9876543003',
      offers: ['Flat ₹50 off', 'Free filter coffee above ₹199']
    },
    {
      name: 'Chinese Wok', slug: 'chinese-wok',
      cuisine: ['Chinese', 'Asian', 'Noodles'],
      rating: 4.2, reviewCount: 756, deliveryTime: '25-35 min',
      minOrder: 149, isOpen: true,
      address: '12 Park Street, Kolkata', phone: '9876543004',
      offers: ['30% off up to ₹80', 'Combo offers available']
    },
    {
      name: 'Burger King', slug: 'burger-king',
      cuisine: ['Burger', 'Fast Food', 'American'],
      rating: 4.1, reviewCount: 2100, deliveryTime: '15-25 min',
      minOrder: 99, isOpen: true,
      address: '56 Linking Road, Mumbai', phone: '9876543005',
      offers: ['Starting at ₹49', 'Family combo ₹399']
    },
    {
      name: 'Sushi Palace', slug: 'sushi-palace',
      cuisine: ['Sushi', 'Japanese', 'Ramen'],
      rating: 4.6, reviewCount: 423, deliveryTime: '35-45 min',
      minOrder: 399, isOpen: true,
      address: '89 Bandra West, Mumbai', phone: '9876543006',
      offers: ['15% off on platters', 'Free miso soup']
    },
    {
      name: 'Tandoori Nights', slug: 'tandoori-nights',
      cuisine: ['Tandoori', 'North Indian', 'Kebab'],
      rating: 4.4, reviewCount: 1089, deliveryTime: '30-40 min',
      minOrder: 199, isOpen: true,
      address: '34 Chandni Chowk, Delhi', phone: '9876543007',
      offers: ['25% off up to ₹150', 'Free naan with every curry']
    },
    {
      name: 'South Indian Delights', slug: 'south-indian-delights',
      cuisine: ['South Indian', 'Kerala', 'Karnataka'],
      rating: 4.3, reviewCount: 945, deliveryTime: '20-30 min',
      minOrder: 79, isOpen: true,
      address: '67 MG Road, Bangalore', phone: '9876543008',
      offers: ['Flat 40% off', 'Breakfast combo ₹149']
    }
  ];

  const restaurants = await Restaurant.insertMany(restaurantsData);

  const menuData = [
    // Biryani House
    { restaurant: restaurants[0]._id, name: 'Hyderabadi Chicken Biryani', description: 'Aromatic basmati rice layered with tender chicken, saffron, and spices', price: 249, category: 'Biryani', isVeg: false, isBestseller: true, spicyLevel: 2 },
    { restaurant: restaurants[0]._id, name: 'Mutton Biryani', description: 'Slow-cooked mutton with fragrant rice and whole spices', price: 329, category: 'Biryani', isVeg: false, isBestseller: true, spicyLevel: 2 },
    { restaurant: restaurants[0]._id, name: 'Veg Biryani', description: 'Garden fresh vegetables cooked with basmati rice', price: 179, category: 'Biryani', isVeg: true, spicyLevel: 1 },
    { restaurant: restaurants[0]._id, name: 'Chicken 65', description: 'Spicy deep-fried chicken with curry leaves', price: 189, category: 'Starters', isVeg: false, spicyLevel: 3 },
    { restaurant: restaurants[0]._id, name: 'Mutton Seekh Kebab', description: 'Minced mutton grilled on skewers', price: 269, category: 'Starters', isVeg: false, spicyLevel: 2 },
    { restaurant: restaurants[0]._id, name: 'Double Ka Meetha', description: 'Traditional Hyderabadi bread pudding', price: 129, category: 'Desserts', isVeg: true },
    { restaurant: restaurants[0]._id, name: 'Phirni', description: 'Creamy rice pudding with cardamom', price: 99, category: 'Desserts', isVeg: true },

    // Pizza Corner
    { restaurant: restaurants[1]._id, name: 'Margherita Pizza', description: 'Classic pizza with mozzarella and fresh basil', price: 199, category: 'Pizza', isVeg: true, isBestseller: true, spicyLevel: 0 },
    { restaurant: restaurants[1]._id, name: 'Pepperoni Pizza', description: 'Loaded with spicy pepperoni and cheese', price: 349, category: 'Pizza', isVeg: false, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[1]._id, name: 'Farm Fresh Pizza', description: 'Bell peppers, olives, corn, and mushrooms', price: 279, category: 'Pizza', isVeg: true, spicyLevel: 0 },
    { restaurant: restaurants[1]._id, name: 'BBQ Chicken Pizza', description: 'Smoky BBQ chicken with onions and cheese', price: 329, category: 'Pizza', isVeg: false, spicyLevel: 1 },
    { restaurant: restaurants[1]._id, name: 'Pasta Arrabiata', description: 'Penne in spicy tomato sauce', price: 199, category: 'Pasta', isVeg: true },
    { restaurant: restaurants[1]._id, name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs', price: 129, category: 'Sides', isVeg: true },

    // Dosa Factory
    { restaurant: restaurants[2]._id, name: 'Masala Dosa', description: 'Crispy dosa with spiced potato filling', price: 89, category: 'Dosa', isVeg: true, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[2]._id, name: 'Mysore Masala Dosa', description: 'Dosa with Mysore chutney and potato masala', price: 109, category: 'Dosa', isVeg: true, isBestseller: true, spicyLevel: 2 },
    { restaurant: restaurants[2]._id, name: 'Rava Dosa', description: 'Semolina dosa with cashews and curry leaves', price: 99, category: 'Dosa', isVeg: true, spicyLevel: 0 },
    { restaurant: restaurants[2]._id, name: 'Onion Dosa', description: 'Dosa topped with caramelized onions', price: 79, category: 'Dosa', isVeg: true },
    { restaurant: restaurants[2]._id, name: 'Idli Sambar', description: 'Soft idlis with hot sambar and chutney', price: 59, category: 'Idli', isVeg: true },
    { restaurant: restaurants[2]._id, name: 'Vada Sambar', description: 'Crispy medu vada with sambar', price: 69, category: 'Idli', isVeg: true },
    { restaurant: restaurants[2]._id, name: 'Filter Coffee', description: 'Authentic South Indian filter coffee', price: 39, category: 'Beverages', isVeg: true, isBestseller: true },

    // Chinese Wok
    { restaurant: restaurants[3]._id, name: 'Hakka Noodles', description: 'Stir-fried noodles with vegetables and soy sauce', price: 149, category: 'Noodles', isVeg: true, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[3]._id, name: 'Chicken Fried Rice', description: 'Wok-tossed rice with chicken and vegetables', price: 179, category: 'Rice', isVeg: false, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[3]._id, name: 'Manchurian Gravy', description: 'Vegetable dumplings in tangy Manchurian sauce', price: 159, category: 'Starters', isVeg: true, spicyLevel: 2 },
    { restaurant: restaurants[3]._id, name: 'Chilli Chicken', description: 'Indo-Chinese style spicy chicken', price: 199, category: 'Starters', isVeg: false, spicyLevel: 3 },
    { restaurant: restaurants[3]._id, name: 'Veg Spring Rolls', description: 'Crispy rolls with vegetable filling', price: 129, category: 'Starters', isVeg: true },
    { restaurant: restaurants[3]._id, name: 'Schezwan Noodles', description: 'Spicy Schezwan flavored noodles', price: 159, category: 'Noodles', isVeg: true, spicyLevel: 3 },

    // Burger King
    { restaurant: restaurants[4]._id, name: 'Whopper Burger', description: 'Flame-grilled patty with veggies and mayo', price: 179, category: 'Burger', isVeg: false, isBestseller: true, spicyLevel: 0 },
    { restaurant: restaurants[4]._id, name: 'Veggie Burger', description: 'Crispy veg patty with lettuce and sauce', price: 129, category: 'Burger', isVeg: true, isBestseller: true, spicyLevel: 0 },
    { restaurant: restaurants[4]._id, name: 'Chicken Zinger', description: 'Crispy chicken fillet with tangy sauce', price: 199, category: 'Burger', isVeg: false, spicyLevel: 1 },
    { restaurant: restaurants[4]._id, name: 'Paneer Burger', description: 'Grilled paneer patty with mint chutney', price: 149, category: 'Burger', isVeg: true },
    { restaurant: restaurants[4]._id, name: 'French Fries', description: 'Golden crispy fries with seasoning', price: 79, category: 'Sides', isVeg: true, isBestseller: true },
    { restaurant: restaurants[4]._id, name: 'Chicken Nuggets', description: '6 pieces of crispy chicken nuggets', price: 149, category: 'Sides', isVeg: false },
    { restaurant: restaurants[4]._id, name: 'Chocolate Shake', description: 'Thick and creamy chocolate milkshake', price: 99, category: 'Beverages', isVeg: true },

    // Sushi Palace
    { restaurant: restaurants[5]._id, name: 'Salmon Nigiri (2 pcs)', description: 'Fresh salmon over seasoned rice', price: 349, category: 'Sushi', isVeg: false, isBestseller: true, spicyLevel: 0 },
    { restaurant: restaurants[5]._id, name: 'California Roll', description: 'Crab, avocado, and cucumber roll', price: 299, category: 'Sushi', isVeg: false, spicyLevel: 0 },
    { restaurant: restaurants[5]._id, name: 'Veg Tempura Roll', description: 'Crispy vegetable tempura in nori wrap', price: 249, category: 'Sushi', isVeg: true },
    { restaurant: restaurants[5]._id, name: 'Miso Ramen', description: 'Rich miso broth with noodles and toppings', price: 329, category: 'Ramen', isVeg: false, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[5]._id, name: 'Edamame', description: 'Steamed and salted soybeans', price: 149, category: 'Sides', isVeg: true },

    // Tandoori Nights
    { restaurant: restaurants[6]._id, name: 'Tandoori Chicken', description: 'Whole chicken leg marinated in spices, cooked in tandoor', price: 269, category: 'Tandoori', isVeg: false, isBestseller: true, spicyLevel: 2 },
    { restaurant: restaurants[6]._id, name: 'Paneer Tikka', description: 'Chargrilled cottage cheese with bell peppers', price: 219, category: 'Tandoori', isVeg: true, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[6]._id, name: 'Butter Chicken', description: 'Creamy tomato gravy with tender chicken', price: 289, category: 'Curry', isVeg: false, isBestseller: true, spicyLevel: 1 },
    { restaurant: restaurants[6]._id, name: 'Dal Makhani', description: 'Slow-cooked black lentils in butter', price: 179, category: 'Curry', isVeg: true, spicyLevel: 0 },
    { restaurant: restaurants[6]._id, name: 'Butter Naan', description: 'Soft naan brushed with butter', price: 49, category: 'Breads', isVeg: true },
    { restaurant: restaurants[6]._id, name: 'Garlic Naan', description: 'Naan topped with garlic and cilantro', price: 59, category: 'Breads', isVeg: true },
    { restaurant: restaurants[6]._id, name: 'Chicken Tikka Masala', description: 'Smoky chicken tikka in rich gravy', price: 279, category: 'Curry', isVeg: false, spicyLevel: 2 },
    { restaurant: restaurants[6]._id, name: 'Raita', description: 'Cumin-spiced yogurt with cucumber', price: 49, category: 'Sides', isVeg: true },

    // South Indian Delights
    { restaurant: restaurants[7]._id, name: 'Kerala Parotta & Beef', description: 'Flaky parotta with spicy beef curry', price: 199, category: 'Kerala', isVeg: false, isBestseller: true, spicyLevel: 2 },
    { restaurant: restaurants[7]._id, name: 'Appam & Egg Curry', description: 'Lacy rice pancakes with egg curry', price: 149, category: 'Kerala', isVeg: false, spicyLevel: 1 },
    { restaurant: restaurants[7]._id, name: 'Uttapam', description: 'Thick rice pancake with toppings', price: 89, category: 'Dosa', isVeg: true, isBestseller: true, spicyLevel: 0 },
    { restaurant: restaurants[7]._id, name: 'Kothu Parotta', description: 'Shredded parotta stir-fried with egg and spices', price: 169, category: 'Kerala', isVeg: false, spicyLevel: 2 },
    { restaurant: restaurants[7]._id, name: 'Pongal', description: 'Comforting rice and moong dal with pepper', price: 79, category: 'Breakfast', isVeg: true },
    { restaurant: restaurants[7]._id, name: 'Payasam', description: 'Traditional Kerala dessert with jaggery', price: 69, category: 'Desserts', isVeg: true },
    { restaurant: restaurants[7]._id, name: 'Bisi Bele Bath', description: 'Karnataka-style spicy rice with lentils', price: 109, category: 'Karnataka', isVeg: true, spicyLevel: 2 }
  ];

  await MenuItem.insertMany(menuData);

  console.log('Seed completed!');
  console.log('Admin: admin@foodie.com / admin123');
  console.log('Customer: john@example.com / customer123');
  process.exit();
};

seed();
