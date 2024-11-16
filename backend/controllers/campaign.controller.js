const Campaign = require('../models/campaign.model');
const Segment = require('../models/segment.model');
const Customer = require('../models/customer.model');
const Message = require('../models/message.model');
const { publishMessage } = require('../utils/publisher');

const createNewCampaign = async (req, res) => {
    try {
        const { title, segmentId, messageTemplate } = req.body;

        const newCampaign = new Campaign({
            title: title,
            segmentId: segmentId,
            status: Math.floor(Math.random() * 51) + 50,
            messageTemplate: messageTemplate
        });

        await newCampaign.save();

        const segment = await Segment.findById(segmentId).populate('customerIds');
        if (!segment) {
            res.status(400).json({ error: "Segment not found" });
        }

        const messages = [];
        for (const customerId of segment.customerIds) {
            const msgData = {
                campaignId: newCampaign._id,
                messageTemplate: messageTemplate,
                customerId: customerId,
            }

            await publishMessage('messages', JSON.stringify(msgData));
        }

        res.status(200).json({ Campaign: newCampaign, msg: "Messages are queued" });
    } catch (error) {
        console.log("Error while creating Campaign: ", error);
        return res.status(400).json({ error: error.message });
    }
}

const getAllCampaigns = async (req, res) => {
    try {
        const allCampaigns = await Campaign.find({});

        res.status(200).json({ Campaigns: allCampaigns })
    } catch (error) {
        console.log("Error while creating Campaign: ", error);
        return res.status(400).json({ error: error.message });
    }
}

const getCampaignById = async (req, res) => {
    try {
        const campaignId = req.params.id;

        const campaign = await Campaign.findById(campaignId);

        if (!campaign) {
            return res.status(400).json("The Campaign does not exist");
        }

        const messages = [];
        const message = await Message.find({ campaignId: campaignId });
        messages.push(message);
        console.log(messages);

        if(messages.length===0) {
            return res.status(400).json("No Message Found");
        }

        res.status(200).json({campaign: campaign, message: messages});
    } catch (error) {
        console.log("Error while creating Campaign: ", error);
        return res.status(400).json({ error: error.message });
    }
}

module.exports = { createNewCampaign, getAllCampaigns, getCampaignById };