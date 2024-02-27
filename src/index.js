const express = require('express');
const authController = require('./routes/auth/authRoute');
const userController = require('./routes/user/userRoute');
const database = require('./models/index');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')

// runing config dotenv
dotenv.config(path.resolve(__dirname, '../.env'));

const app = express();
const port = 5000;

// check database connection
database.checkConnectionDb();

// applicationa middlewares
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.json());
app.use(cookieParser());

// app Route
app.use(authController);
app.use(userController);

app.listen(port, () => {
    console.log(`server run on http://localhost:${port}`);
});