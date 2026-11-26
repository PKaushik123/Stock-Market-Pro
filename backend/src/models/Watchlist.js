const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    stockSymbols: {
      type: [String],
      default: [],
      validate: {
        validator: function (symbols) {
          return Array.isArray(symbols) && symbols.every((symbol) => typeof symbol === 'string');
        },
        message: 'Symbols must be strings',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Watchlist', watchlistSchema);
