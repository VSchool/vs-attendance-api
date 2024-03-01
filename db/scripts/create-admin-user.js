const { MongoClient } = require("mongodb");
const { connect, createClient } = require("./lib");

/**
 * @param {MongoClient} client
 */
const createAdminUser = async (client) => {
  await client
    .db()
    .collection("users")
    .insertOne({
      admin: true,
      username: "admin",
      password: require("crypto")
        .createHash("sha256")
        .update(process.env.ADMIN_USER_PASSWORD, "utf8")
        .digest("hex"),
      first_name: "admin",
      last_name: "user",
    });
};

const main = async () => {
  const client = createClient();
  try {
    await connect(client);
    await createAdminUser(client);
    console.log("admin user created!");
  } catch (err) {
    console.error(err);
  } finally {
    client.close();
  }
};

main();
