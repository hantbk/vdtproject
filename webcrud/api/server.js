const mongoose = require('mongoose');
const app = require('./api');

const PORT = process.env.PORT || 9000;
const DB_URL = "mongodb://mongo:27017/crud";

// Connect to the database
mongoose.connect(DB_URL)
.then(() => {
    console.log('Connected to the database');
    // Start the server only after successful connection to the database
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('Failed to connect to the database', err);
});
