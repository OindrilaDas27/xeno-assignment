const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const customerRouter = require('./routes/customer.route');
const orderRouter = require('./routes/order.route');
const userRouter = require('./routes/user.route');
const segmentRouter = require('./routes/segment.route');
const campaignRouter = require('./routes/campaign.route');

// const publisher = require('./utils/publisher');
// const subscriber = require('./utils/subscriber');

const cors = require('cors')

dotenv.config();
const app = express();
// app.use(express.json());

app.use(
    express.json(),
    cors({
        origin: [process.env.FRONTEND_URI],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

const PORT = 8080;
const uri = process.env.MONGO_URI;

app.use('/api/customer', customerRouter);
app.use('/api/order', orderRouter);
app.use('/api/user', userRouter);
app.use('/api/segment', segmentRouter);
app.use('/api/campaign', campaignRouter);

mongoose.connect(uri, {
    socketTimeoutMS: 45000,
    connectTimeoutMS: 45000,
});

mongoose.connection
    .once('open', () => {
        console.log('MongoDb is connected successfully...');
        const server = app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .on('error', (error) => {
        console.log('Error: ', error);
    });

// process.on('SIGINT', async () => {
//     try {
//         // Gracefully shut down the Redis connections
//         await publisher.quit();
//         await subscriber.quit();
//         console.log('Gracefully shutting down...');
//         process.exit(0);
//     } catch (error) {
//         console.error('Error during shutdown:', error);
//         process.exit(1); // If error occurs, exit with failure status
//     }
// });