const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const keys = require('./config/keys');

const app = express();

mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
    .then(() => console.log("MongoDB has been connected"))
    .catch(error => console.log(error));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());


const authRoutes = require('./routes/auth');
const analyticsRoutes = require('./routes/analytics');
const categoryRoutes = require('./routes/category');
const orderRoutes = require('./routes/order');
const positionsRoutes = require('./routes/position');




app.use('/api/auth', authRoutes);
app.use('/api/analytisc', analyticsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/position', positionsRoutes);

module.exports = app;