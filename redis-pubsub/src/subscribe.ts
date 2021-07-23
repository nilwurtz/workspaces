import IORedis from "ioredis";

export class Subscriber {
  private readonly redis: IORedis.Redis;

  // 接続
  constructor(port: number = 6333, sub_channel: string) {
    this.redis = new IORedis(port);
    this.redis.subscribe(sub_channel);
    this.redis.on("message", function(channel: string, message: string) {
      console.log("Receive message %s from channel %s", message, channel);
    });
  }

  close(): void {
    this.redis.disconnect();
    console.log("Subscriber disconnected!");
  }
}
