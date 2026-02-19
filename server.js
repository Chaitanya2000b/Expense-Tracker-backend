require("dotenv").config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.error(err));


app.use(express.json());

app.get('/api/categories', (req, res) => {
  const categories = [
    { name: 'Housing', amount: 0 },
    { name: 'Transportation', amount: 0 },
    { name: 'Food', amount: 0 },
    { name: 'Entertainment', amount: 0 },
    { name: 'Recharges', amount: 0 },
    { name: 'Credit Card Bills', amount: 0 },
    { name: 'Miscellaneous', amount: 0 },
  ];
  res.json(categories);
});

app.get("/api/monthly", async (req, res) => {
  const data = await Expense.aggregate([
    {
      $group: {
        _id: { $month: "$date" },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
});

app.post('/api/expenses', (req, res) => {
  const expense = new Expense({
    amount: req.body.amount,
    category: req.body.category,
    description: req.body.description,
  });
  expense.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error adding expense');
    } else {
      res.json({ message: 'Expense added successfully' });
    }
  });
});

app.get('/api/expenses', (req, res) => {
  Expense.find((err, expenses) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching expenses');
    } else {
      res.json(expenses);
    }
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});