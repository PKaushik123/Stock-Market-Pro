const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let connectionPromise = null;
let memoryServer = null;

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/stockmarket-pro';

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.host;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const mongoUri = process.env.MONGODB_URI || DEFAULT_LOCAL_URI;

  try {
    connectionPromise = mongoose.connect(mongoUri).then(() => {
      console.log('MongoDB connected');
      return mongoUri;
    });

    await connectionPromise;
    return mongoUri;
  } catch (error) {
    if (!process.env.MONGODB_URI) {
      try {
        memoryServer = await MongoMemoryServer.create();
        const inMemoryUri = memoryServer.getUri();

        connectionPromise = mongoose.connect(inMemoryUri).then(() => {
          console.log('MongoDB connected using in-memory server');
          return inMemoryUri;
        });

        await connectionPromise;
        return inMemoryUri;
      } catch (memoryError) {
        console.error('MongoDB in-memory fallback failed:', memoryError.message);
      }
    }

    connectionPromise = null;
    console.error('MongoDB connection error:', error.message);
    console.error('Start a local MongoDB instance or set MONGODB_URI to a reachable database.');
    throw error;
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }

  connectionPromise = null;
};

module.exports = { connectDB, disconnectDB };
