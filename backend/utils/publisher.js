const redis = require('redis');
const publisher = redis.createClient();

(async () => {
    try {
        await publisher.connect();
        console.log("Publisher is connected to Redis");
    } catch (error) {
        console.error("Error connecting publisher to Redis: ", error);
    }
})();

const publishMessage = async (channel, message) => {
    try {
        console.log(`Publishing to ${channel}:`, message);
        await publisher.publish(channel, message);
    } catch (error) {
        console.error("Error publishing message:", error);
    }
};

module.exports = { publishMessage };