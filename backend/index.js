const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const customerRouter = require('./routes/customer.route');
const orderRouter = require('./routes/order.route');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = 8080;
const uri = process.env.MONGO_URI;

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

app.use('/api/customer', customerRouter);
app.use('/api/order', orderRouter);

mongoose.connect(uri);

mongoose.connection
    .once('open', () => {
        console.log('MongoDb is connected successfully...');
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .on('error', (error) => {
        console.log('Error: ', error);
    })