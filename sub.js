const redis = require("redis");

const subscriber = redis.createClient();


let messageCount = 0;

subscriber.on("subscribe", function(channel, count) {
  console.log(channel, '구독시작');
});

subscriber.on("message", function(channel, message) {
  messageCount += 1;
  console.log("Subscriber received message in channel '" + channel + "': " + message);

  if (messageCount > 5) {
    subscriber.unsubscribe();
    subscriber.quit();
  }
});

subscriber.subscribe("a channel");
