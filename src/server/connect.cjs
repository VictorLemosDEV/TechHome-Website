const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './config.env' });

const client = new MongoClient(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect(); // Connect to MongoDB
            database = client.db('TechHome'); // Set the database
            console.log('Successfully connected to MongoDB');
        } catch (error) {
            console.error('Failed to connect to MongoDB', error);
            process.exit(1); // Exit the process with failure
        }
    },
    getDb: () => {
        if (!database) {
            throw new Error('Database not initialized. Call connectToServer first.');
        }
        return database;
    }
};
