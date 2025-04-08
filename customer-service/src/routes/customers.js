const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Customer Schema
const customerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  dateOfBirth: { type: Date },
  notes: { type: String }
}, {
  timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

// Routes
// 1. Initialize sample data
router.post('/init-sample', async (req, res) => {
  try {
    await Customer.deleteMany({});
    const sampleCustomers = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@email.com",
        phone: "123-456-7890",
        address: {
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001"
        },
        gender: "male",
        dateOfBirth: new Date("1990-01-15")
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@email.com",
        phone: "098-765-4321",
        address: {
          street: "456 Oak Ave",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90001"
        },
        gender: "female",
        dateOfBirth: new Date("1992-05-20")
      }
    ];
    
    const result = await Customer.insertMany(sampleCustomers);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Get customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Create new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 6. Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Search customers
router.get('/search/query', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.query;
    const query = {};
    
    if (firstName) query.firstName = new RegExp(firstName, 'i');
    if (lastName) query.lastName = new RegExp(lastName, 'i');
    if (email) query.email = new RegExp(email, 'i');
    
    const customers = await Customer.find(query);
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;