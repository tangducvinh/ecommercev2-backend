const amqp = require("amqplib");

const messages = "hello, RabbitMQ";

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "test-topic";
    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send messages to consumer channel
    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`message sent: `, messages);
  } catch (e) {
    console.error(e);
  }
};

runProducer().catch(console.error);
