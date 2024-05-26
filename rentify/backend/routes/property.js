// backend/routes/property.js
const express = require('express');
const Property = require('../models/Property');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/add', auth, async (req, res) => {
  try {
    const property = new Property({ ...req.body, seller: req.user.id });
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().populate('seller', 'firstName lastName email phoneNumber');
    res.json(properties);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/update/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    Object.assign(property, req.body);
    await property.save();
    res.json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (property.seller.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await property.remove();
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
