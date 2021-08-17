const redis = require("redis");

const publisher = redis.createClient();

publisher.publish("a channel", "a message");
publisher.publish("a channel", "another message");

publisher.quit();