const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const customerRouter = require('./routes/customer.route');
const orderRouter = require('./routes/order.route');
const userRouter = require('./routes/user.route');
const segmentRouter = require('./routes/segment.route');
const cors = require('cors')

dotenv.config();
const app = express();
app.use(express.json());

app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: "GET,POST,PUT,DELETE,OPTIONS",
    })
);

const PORT = 8080;
const uri = process.env.MONGO_URI;

app.use('/api/customer', customerRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/segment', segmentRouter);

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