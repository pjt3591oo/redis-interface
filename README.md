* redis 실행

```sh
$ docker run -i -t --name myredis -d -p 6379:6379 redis
```

* 컨테이너 접속

```sh
$ docker exec -it myredis /bin/bash

root@d61d7f5c8271:/data# redis-cli

127.0.0.1:6379> 
```

* GUI 툴: p3x-redis-ui

```
https://www.electronjs.org/apps/p3x-redis-ui
```

* connect

```js
const redis = require("redis");
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});
```

# 자료구조

* string

```js

client.set("key", "mung", (err, result) => {
  console.log('set result');
  console.log(result);
});

client.get("key", (err, result) => {
  console.log('get result');
  console.log(result);
});
```

* hash

```js
// 키: friends
// 값: {name: 'mung', 'age': 29}
client.hmset('friends', 'name', 'mung', 'age', 29);
client.hgetall('friends', (err, obj) => {
  console.log(obj); // { name: 'mung', age: '29' }
});
```

* list

```js
// 오른쪽에서 하나씩 밀어넣기
// 키: fruits
// 값: 'apple1', 'orange2', 'apple3' 순서대로 오른쪽에서 push
client.rpush('fruits', 'apple1', 'orange2', 'apple3');

// 왼쪽에서 하나씩 밀어넣기
// 값: 'banana', 'pear' 순서대로 왼쪽에서 push
client.lpush('fruits', 'banana1', 'pear2');

// 키, 시작, 끝(-1은 마지막을 의미)
client.lrange('fruits', 0, -1, (err, arr) => {
  console.log(arr); // ['pear2', 'banana1', 'apple1', 'orange2', 'apple3']
});
```

* set

순서를 보장하지 않으며 중복을 허용하지 않음

```js
client.sadd('animals', 'dog', 'cat', 'bear', 'cat', 'lion');
client.smembers('animals', (err, set) => {
  console.log(set); // ['cat', 'dog', 'bear', 'lion']
});
```

* sorted set

정렬된 set 

첫 번째 인자는 key
두 번쨰 인자는 다음과 같다.
(180, 'zero'), (158, 'aero'), (167, 'nero'), (166, 'hero')

```js
client.zadd('height', 180, 'mung0', 168, 'mung1', 176, 'mung2', 172, 'mung3');
client.zrange('height', 0, -1, (err, sset) => {
  console.log(sset); // ['mung0', 'mung2', 'mung3', 'mung1'
});
```

* geo

위/경도

longitude가 먼저등장

첫 번째 인자: key
두 번쨰 인자부터는 다음과 같다

(126.97, 37.56, 'seoul'), (129.07, 35.17, 'busan'), (126.70, 37.45, 'incheon')

```js
client.geoadd('cities', 126.97, 37.56, 'seoul', 129.07, 35.17, 'busan', 126.70, 37.45, 'incheon');

// 두 위치간 거리
client.geodist('cities', 'seoul', 'busan', (err, dist) => {
  console.log(dist); // 325619.5465
});

// 특정위치에서 해당하는 지역
client.georadius('cities', 126.8, 37.5, 50, 'km', (err, cities) => {
  console.log(cities); // ['incheon', 'seoul']
});
```

# utils

* 키 지우기

```js
client.del('key');
```

* 키 존재 확인

```js
client.exists('height'); // 1: 있을 때, 0: 없을 때
```

* 키 이름 변경

```js
client.rename('cities', 'countries');
```

찾는 키가 없으면 에러발생

```
ReplyError: ERR no such key
    at parseError (/Users/fles_dev01/Desktop/redis-rrr/node_modules/redis-parser/lib/parser.js:179:12)
    at parseType (/Users/fles_dev01/Desktop/redis-rrr/node_modules/redis-parser/lib/parser.js:302:14) {
  command: 'RENAME',
  args: [ 'animals', 'pets' ],
  code: 'ERR'
}
```

# pub/sub

pub: 생산자
sub: 구독자

* sub

```js
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
```

* pub

```js
const redis = require("redis");

const publisher = redis.createClient();

publisher.publish("a channel", "a message");
publisher.publish("a channel", "another message");
```

