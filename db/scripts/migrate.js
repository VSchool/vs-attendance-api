const { MongoClient } = require('mongodb');
const fns = require('date-fns');

const main = async () => {
    const client = new MongoClient(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    try {
        await client.connect();
        console.log('connected to db' + process.env.MONGODB_URI);

        const entries = await client.db().collection('entries').find().toArray();

        await Promise.all(entries.map(entry => {
            return client.db()
                .collection('entries')
                .updateOne(
                    { _id: entry._id },
                    { $set: { week_of: fns.startOfDay(fns.previousMonday(new Date(entry.start))) } }
                )
        }));

    } catch (err) {
        console.error(err)
    } finally {
        client.close();
    }
}

main()