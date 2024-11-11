const Customer = require('../models/customer.model');

const createCustomer = async(req, res) => {
    try {
        const customerData = req.body;

        let checkCustomer = await Customer.findOne({ name: customerData.name });

        if(checkCustomer!==null) return res.status(400).send("Customer already exists");

        const newCustomer = new Customer({
            name: customerData.name,
        });

        const customer = await newCustomer.save();

        res.status(200).json({message: "Created new Customer", customer});
    } catch (error) {
        console.log('Error in create customer: ', error);
        return res.status(400).json(error);
    }
}

const getAllCustomers = async(req, res) => {
    try {
        const customers = await Customer.find({});

        res.status(200).json(customers);
    } catch (error) {
        console.log("Error in get all customers: ", error);
        return res.status(400).json(error);
    }
}

const getCustomerId = async(req, res) => {
    try {
        const customerId = req.params.id;

        const customer = await Customer.findById(customerId);

        if(!customer) {
            return res.status(400).json({message: "Customer not found"});
        };

        res.status(200).json(customer);
    } catch (error) {
        console.log('Error in get customer id: ', error);
        return res.status(400).json(error);
    }
}

module.exports = { createCustomer, getCustomerId, getAllCustomers };