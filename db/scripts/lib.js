const { MongoClient } = require("mongodb");

const DB_CONNECTION = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

const createClient = () => new MongoClient(DB_CONNECTION);

const connect = async (client) => {
  await client.connect();
  console.log("connected to " + DB_CONNECTION);
};

module.exports = {
  createClient,
  connect,
};
