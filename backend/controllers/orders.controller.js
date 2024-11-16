const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const { publishMessage } = require('../utils/publisher');

const createOrder = async (req, res) => {
    try {
        const order = req.body;

        const customer = await Customer.findById(order.customerId);

        if (!customer) {
            return res.status(400).json({ error: "Customer does not exist to create order" });
        }

        if(order.cost==0) {
            return res.status(400).json({ error: "Order must not be 0" });
        }

        await publishMessage('orders', JSON.stringify(order));

        res.status(200).json("Order is queue");
    } catch (error) {
        console.log("Error in create Order: ", error);
        res.status(400).json(error);
    }
}

const getAllOrders = async(req, res) => {
    try {
        const orders = await Order.find({});

        res.status(200).json(orders);
    } catch (error) {
        console.log("Error in get all orders: ", error);
        return res.status(400).json(error);
    }
}

const getOrderById = async(req, res) => {
    try {
        const orderId = req.params.id;

        const order = await Order.findById(orderId);

        if(!order) {
            return res.status(400).json({message: "Order not found"});
        };

        res.status(200).json(order);
    } catch (error) {
        console.log("Error in get order by id: ", error);
        return res.status(400).json(error);
    }
}

module.exports = { createOrder, getAllOrders, getOrderById };