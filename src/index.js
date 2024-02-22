const express = require('express');
const authController = require('./routes/auth/authRoute');
const database = require('./models/index'); 
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(path.resolve(__dirname, '../.env'));

const app = express();
const port = 5000;
database.checkConnectionDb();

app.use(express.json());

// App Route
app.use(authController);

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});