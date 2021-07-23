import IORedis from "ioredis";

export class Publisher {
  private readonly redis: IORedis.Redis;
  private channel: string;
  // 接続
  constructor(port: number = 6333, channel: string) {
    this.redis = new IORedis(port);
    this.channel = channel;
  }

  async pub(message: string): Promise<void> {
    this.redis.publish("test", message);
  }

  close(): void {
    this.redis.disconnect();
    console.log("Publisher disconnected!");
  }
}
