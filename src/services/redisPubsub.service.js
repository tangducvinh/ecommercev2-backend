// const Redis = require("redis");
const redis = require("ioredis");

class RedisPubService {
  constructor() {
    // this.subscriber = Redis.createClient();
    // this.publisher = Redis.createClient();
    const redisClient = redis.createClient({
      host: "redis-10482.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com",
      port: 10482,
      username: "default",
      password: "Q0LbNfWvufUEbObWSSBdpYdCVgkghu5F",
    });

    redisClient.on("connect", () => {
      console.log("connected to redis successfully!");
    });

    redisClient.on("error", (error) => {
      console.log("Redis connection error :", error);
    });

    const redisClient1 = redis.createClient({
      host: "redis-10482.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com",
      port: 10482,
      username: "default",
      password: "Q0LbNfWvufUEbObWSSBdpYdCVgkghu5F",
    });

    this.subscriber = redisClient;
    this.publisher = redisClient1;
  }

  publish(channel, message) {
    return new Promise((resolve, reject) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      });
    });
  }

  subscribe(channel, callback) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        callback(channel, message);
      }
    });
  }
}

module.exports = new RedisPubService();
