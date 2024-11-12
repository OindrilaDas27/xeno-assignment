const Segment = require('../models/segment.model');
const Customer = require('../models/customer.model');
const Order = require('../models/order.model');

const createSegment = async (req, res) => {
    try {
        const { query, userId } = req.body;

        // Parse the query into conditions
        const conditions = parseQueryToConditions(query);
        console.log("Parsed Conditions: ", conditions);  // Log the parsed conditions

        // Aggregate orders to get total spending and order count per customer
        const aggregateData = await Order.aggregate([
            {
                $group: {
                    _id: "$customerId",
                    totalSpending: { $sum: "$cost" },
                    orderCount: { $count: {} }
                }
            },
            {
                $match: conditions // Make sure that the conditions match correctly here
            }
        ]);
        

        console.log("Aggregated Data: ", aggregateData);  // Log aggregated data

        // Get customer size
        const customerSize = aggregateData.length;

        // Save the new segment with customer size
        const newSegment = new Segment({
            query: query,
            userId: userId,
            customerSize: customerSize
        });

        const saveSegment = await newSegment.save();

        // Get the customer IDs from the aggregate data
        const customerIds = aggregateData.map(item => item._id);

        // Retrieve customer details
        const customers = await Customer.find({ _id: { $in: customerIds } });

        // Return the segment and customers
        res.status(200).json({ saveSegment, customers });

    } catch (error) {
        console.log("Error while creating Segment: ", error);
        return res.status(400).json({ error: error.message });
    }
};

// Parse the query and convert it into MongoDB query conditions
function parseQueryToConditions(query) {
    const conditions = [];

    // Split the query based on logical operators like AND/OR
    const parts = splitQueryByLogicalOperators(query);
    console.log("Query Parts: ", parts);  // Log the parts to check

    // Loop through each part of the query and extract conditions
    parts.forEach(part => {
        const condition = parseCondition(part);
        if (condition) {
            conditions.push(condition);
        }
    });

    // Combine conditions with $and or $or
    if (query.includes('AND')) {
        return { $and: conditions };
    } else if (query.includes('OR')) {
        return { $or: conditions };
    }

    return conditions.length > 1 ? { $and: conditions } : conditions[0];
}

// Split the query by AND/OR
function splitQueryByLogicalOperators(query) {
    let regex = / AND | OR /i;  // Split by 'AND' or 'OR'
    return query.split(regex).map(part => part.trim());
}

// Parse each condition (e.g., "totalSpending > 10000")
function parseCondition(part) {
    const operators = [
        { regex: /([a-zA-Z]+)\s*=\s*(\d+)/, operator: '$eq' },
        { regex: /([a-zA-Z]+)\s*>\s*(\d+)/, operator: '$gt' },
        { regex: /([a-zA-Z]+)\s*<\s*(\d+)/, operator: '$lt' },
        { regex: /([a-zA-Z]+)\s*>=\s*(\d+)/, operator: '$gte' },
        { regex: /([a-zA-Z]+)\s*<=\s*(\d+)/, operator: '$lte' },
        { regex: /([a-zA-Z]+)\s*!=\s*(\d+)/, operator: '$ne' }
    ];

    // Try matching the part with known patterns
    for (let i = 0; i < operators.length; i++) {
        const match = part.match(operators[i].regex);
        if (match) {
            let field = match[1];  // Use 'let' to allow reassignment
            const value = Number(match[2]);  // The value to compare with (e.g., 10000)

            // Adjust field names for specific query conditions:
            if (field === 'totalSpending') {
                field = 'totalAmount';  // Ensure this matches the actual field in your Order model
            }
            if (field === 'orderCount') {
                field = 'orderCount';  // This is fine now because 'orderCount' should be counted from aggregation
            }

            // Return the condition for MongoDB
            return { [field]: { [operators[i].operator]: value } };
        }
    }

    // If no match, return null
    return null;
}


module.exports = { createSegment };
