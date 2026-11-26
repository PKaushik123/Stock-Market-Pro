const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    averageBuyPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    cashBalance: {
      type: Number,
      required: true,
      default: 1000,
      min: 0,
    },
    totalInvested: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    holdings: {
      type: [holdingSchema],
      default: [],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Portfolio', portfolioSchema);
