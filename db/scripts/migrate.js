const { MongoClient } = require("mongodb");
const { connect, createClient } = require("./lib");

/**
 * @param {MongoClient} client
 */
const task = async (client) => {
  // no migration tasks in this release
};

const main = async () => {
  const client = createClient();
  try {
    await connect(client);
    await task(client);
    console.log("migration complete!");
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

main();
