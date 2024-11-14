const Segment = require('../models/segment.model');
const Customer = require('../models/customer.model');
const Order = require('../models/order.model');

const createSegment = async (req, res) => {
    try {
        const { query, userId } = req.body;

        const conditions = parseQueryToConditions(query);
        console.log("Parsed Conditions: ", conditions);

        const aggregateData = await Order.aggregate([
            {
                $group: {
                    _id: "$customerId",
                    totalSpending: { $sum: "$cost" },
                    orderCount: { $count: {} }
                }
            },
            {
                $match: conditions 
            }
        ]);
        
        console.log("Aggregated Data: ", aggregateData);  

        const customerSize = aggregateData.length;
        const customerIds = aggregateData.map(item => item._id);
        console.log(customerIds)

        const newSegment = new Segment({
            query: query,
            userId: userId,
            customerSize: customerSize,
            customerIds: customerIds
        });

        const saveSegment = await newSegment.save();

        const customers = await Customer.find({ _id: { $in: customerIds } });

        res.status(200).json({ saveSegment, customers });

    } catch (error) {
        console.log("Error while creating Segment: ", error);
        return res.status(400).json({ error: error.message });
    }
};

function parseQueryToConditions(query) {
    const conditions = [];

    const parts = splitQueryByLogicalOperators(query);
    console.log("Query Parts: ", parts);  

    parts.forEach(part => {
        const condition = parseCondition(part);
        if (condition) {
            conditions.push(condition);
        }
    });

    if (query.includes('AND')) {
        return { $and: conditions };
    } else if (query.includes('OR')) {
        return { $or: conditions };
    }

    return conditions.length > 1 ? { $and: conditions } : conditions[0];
}

function splitQueryByLogicalOperators(query) {
    let regex = / AND | OR /i;  
    return query.split(regex).map(part => part.trim());
}

function parseCondition(part) {
    const operators = [
        { regex: /([a-zA-Z]+)\s*=\s*(\d+)/, operator: '$eq' },
        { regex: /([a-zA-Z]+)\s*>\s*(\d+)/, operator: '$gt' },
        { regex: /([a-zA-Z]+)\s*<\s*(\d+)/, operator: '$lt' },
        { regex: /([a-zA-Z]+)\s*>=\s*(\d+)/, operator: '$gte' },
        { regex: /([a-zA-Z]+)\s*<=\s*(\d+)/, operator: '$lte' },
    ];

    for (let i = 0; i < operators.length; i++) {
        const match = part.match(operators[i].regex);
        if (match) {
            let field = match[1];  
            const value = Number(match[2]);  

            return { [field]: { [operators[i].operator]: value } };
        }
    }

    // If no match, return null
    return null;
}


module.exports = { createSegment };
