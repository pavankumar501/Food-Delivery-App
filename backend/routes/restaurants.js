const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { cuisine, rating, search, sort, isOpen } = req.query;
    let query = {};

    if (cuisine) query.cuisine = { $in: cuisine.split(',') };
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (isOpen === 'true') query.isOpen = true;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } }
      ];
    }

    let sortObj = {};
    if (sort === 'rating') sortObj.rating = -1;
    else if (sort === 'deliveryTime') sortObj.deliveryTime = 1;
    else if (sort === 'costLow') sortObj.minOrder = 1;
    else if (sort === 'costHigh') sortObj.minOrder = -1;

    const restaurants = await Restaurant.find(query).sort(sortObj);
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:slug/menu', async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug });
    if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' });

    const items = await MenuItem.find({ restaurant: restaurant._id });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
