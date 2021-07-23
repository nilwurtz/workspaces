import { Publisher } from "./publish";
import { Subscriber } from "./subscribe";

const redisConfig = {
  port: 6333,
  channel: "test"
};

let pub = new Publisher(redisConfig.port, redisConfig.channel);

// time sleep
function sleep(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => resolve(), milliseconds);
  });
}

// main
async function main() {
  console.log("Started publisher...");
  // Sleep 4 seconds and then publish garage door "opened" event.
  await sleep(4000);
  pub.pub("hello!");
  await sleep(1000);
  pub.pub("test chennel!");
  await sleep(1000);
  pub.pub("message from");
  await sleep(1000);
  pub.pub("typescript!");

  await sleep(1000);
  pub.close();
  console.log("redis end");
}

async function listen(): Promise<void> {
  console.log("Started Subscriber...");
  let sub = new Subscriber(redisConfig.port, redisConfig.channel);
}
// main();
listen();
