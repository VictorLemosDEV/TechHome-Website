const express = require('express');
const cors = require('cors');
const connect = require('./connect.cjs');
const postRoutes = require('./postRoutes'); // Import your postRoutes

const app = express();
const PORT = 5000;

// Middleware to parse JSON bodies and apply CORS
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// Mount the postRoutes to '/data'
app.use('/data', postRoutes);

// Connect to the database and start the server
connect.connectToServer()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error starting server', error);
        process.exit(1);
    });
