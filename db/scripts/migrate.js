const { MongoClient } = require("mongodb");
const fns = require("date-fns");

const createClient = () =>
  new MongoClient(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);

const connect = async (client) => {
  await client.connect();
  console.log("connected to db" + process.env.MONGODB_URI);
};

/**
 * @param {MongoClient} client
 */
const task = async (client) => {
  // create admin user
  await client
    .db()
    .collection("users")
    .insertOne({
      admin: true,
      username: "admin",
      password: require("crypto")
        .createHash("sha256")
        .update("test", "utf8")
        .digest("hex"),
      first_name: "admin",
      last_name: "user",
    });
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
