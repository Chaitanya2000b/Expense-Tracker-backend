const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: false },
});

const Expense = mongoose.model('Expense', expenseSchema);

module.exports = Expense;