const redis = require('redis');
const subscriber = redis.createClient();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const Customer = require('../models/customer.model');
const Order = require('../models/order.model');
const Message = require('../models/message.model');

const BATCH_SIZE = 5;
const BATCH_INTERVAL = 3000;
let messageQueue = [];

const processBatch = async () => {
    if (messageQueue.length > 0) {
        console.log(`Processing batch of ${messageQueue.length} messages...`);

        try {
            const messagesToInsert = [];

            for (const messageData of messageQueue) {
                const { campaignId, customerId, messageTemplate } = messageData;

                const customer = await Customer.findById(customerId);
                if (!customer) {
                    console.error(`Customer not found: ${customerId}`);
                    continue;
                }

                const msg = messageTemplate.replace('{name}', customer.name);

                messagesToInsert.push({
                    message: msg,
                    campaignId,
                    customerId,
                    customerName: customer.name,
                    status: Math.floor(Math.random() * 51) + 50,
                });
            }

            await Message.insertMany(messagesToInsert);
            console.log('Batch processed successfully!');
        } catch (error) {
            console.error('Error processing batch:', error);
        } finally {
            messageQueue = [];
        }
    }
};

(async () => {
    try {
        await subscriber.connect();
        console.log("Subscriber is connected to redis");

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Mongo is connected (redis)')

        await subscriber.subscribe('customers', async (message) => {
            try {
                const customerData = JSON.parse(message);

                const newCustomer = new Customer({
                    name: customerData.name
                });

                await newCustomer.save();

                console.log('New Customer Has been created: ', newCustomer);
            } catch (error) {
                console.error("Error in processing messgae: ", message, error);
            }
        });

        await subscriber.subscribe('orders', async (message) => {
            try {
                const order = JSON.parse(message);

                const newOrder = new Order({
                    cost: order.cost,
                    customerId: order.customerId
                });

                const saveOrder = await newOrder.save();
                const customer = await Customer.findById(order.customerId);

                customer.countVisits += 1;
                customer.totalSpending += saveOrder.cost;
                await customer.save();
                console.log("Order created successfully!", saveOrder, customer);
            } catch (error) {
                console.error("Error in processing messgae: ", message, error);
            }
        })

        await subscriber.subscribe('messages', async (message) => {
            try {
                const msg = JSON.parse(message);
                messageQueue.push(msg);
                if(messageQueue.length >= BATCH_SIZE) {
                    processBatch();
                }
            } catch (error) {
                console.error("Error in processing messgaess: ", message, error);
            }
        })
    } catch (error) {
        console.error("Error in redis subscriber: ", error);
    }
})();