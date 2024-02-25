const { MongoClient } = require('mongodb');
const fns = require('date-fns');

const generateEntriesOnDay = (year, month, day) => {
    const NAMES = ['john doe'.split(' '), 'adam smith'.split(' '), 'jane kelly'.split(' '), 'rob lowe'.split(' ')];
    const getRandomDuration = () => {
        return Math.floor(Math.random() * 8) + 1;
    }
    const getRandomStartTime = () => Math.floor(Math.random() * 4) + 15;

    return NAMES.map(([first_name, last_name]) => {
        const start = new Date(year, month, day, getRandomStartTime());
        const end = fns.addHours(start, getRandomDuration());
        const week_of = fns.startOfDay(fns.previousMonday(start));
        const email = `${first_name}@${last_name}.com`;

        return {
            first_name,
            last_name,
            email,
            start,
            end,
            week_of,
            createdAt: start
        }
    })
}

const generateEntriesOnDays = ({ month, startingDay, totalDays, year = 2024 }) => {
    return Array(totalDays).fill(null).reduce((output, _, i) => [...output, ...generateEntriesOnDay(year, month, i + startingDay)], [])
}

const main = async () => {
    const client = new MongoClient(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    try {
        await client.connect();
        if (client.db().databaseName !== 'qa') throw Error('Warning: Use only for test envrionments');
        console.log('connected to db' + process.env.MONGODB_URI);

        const entries = (await client.db().collections({ nameOnly: true })).find(col => col.collectionName === 'entries').collectionName;
        if (entries) await client.db().dropCollection('entries');
        await client.db().createCollection('entries');
        await client.db().collection('entries').insertMany(
            [
                { month: 0, startingDay: 4, totalDays: 5 },
                { month: 0, startingDay: 12, totalDays: 4 },
                { month: 1, startingDay: 1, totalDays: 5 },
                { month: 1, startingDay: 7, totalDays: 4 },
                { month: 1, startingDay: 15, totalDays: 4 },
            ]
                .reduce((output, config) => [...output, ...generateEntriesOnDays(config)], [])
        )

    } catch (err) {
        console.error(err)
    } finally {
        client.close();
    }
}

main() 