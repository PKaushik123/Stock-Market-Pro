const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    side: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    referencePrice: { type: Number, required: true, min: 0 },
    totalValue: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['EXECUTED', 'PENDING', 'REJECTED'],
      default: 'EXECUTED',
    },
    isSimulated: {
      type: Boolean,
      default: true,
    },
    orderType: {
      type: String,
      enum: ['MARKET', 'LIMIT'],
      default: 'MARKET',
    },
    limitPrice: { type: Number, min: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema);
