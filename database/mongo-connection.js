import mongoose from 'mongoose';
import express from "express";

// eslint-disable-next-line require-jsdoc
async function atlasConnection() {
  const username = encodeURIComponent(process.env.MONGO_USER);
  const password = encodeURIComponent(process.env.MONGO_PASSWORD);
  const atlasCluster = process.env.MONGO_CLUSTER;
  const atlasDatabase = process.env.MONGO_DB;

  // eslint-disable-next-line max-len
  const uri = `mongodb+srv://${username}:${password}@${atlasCluster}/${atlasDatabase}?retryWrites=true&w=majority`;

  try {
    mongoose.connect(
      uri,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      () => console.log('Database connection established!'),
    );
  } catch (err) {
    console.error(`Error connecting to the database. \n ${err}`);
  }

  const dbConnection = mongoose.connection;
  dbConnection.on('error', (err) => console.log(`Connection error ${err}`));
  dbConnection.once('open', () => console.log('Connected to DB!'));
}

export default atlasConnection;
