const redis = require("redis");
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

client.set("key", "mung", (err, result) => {
  console.log('set result');
  console.log(result);
});

client.get("key", (err, result) => {
  console.log('get result');
  console.log(result);
});