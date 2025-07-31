import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';

const KAFKA_BROKERS = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(
  ','
);
const TOPIC = process.env.KAFKA_TOPIC ?? 'test-topic';
const GROUP_ID = process.env.KAFKA_GROUP_ID ?? 'demo-group';
const CLIENT_ID = process.env.KAFKA_CLIENT_ID ?? 'consumer-app';

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: KAFKA_BROKERS,
});

const consumer: Consumer = kafka.consumer({ groupId: GROUP_ID });

async function runConsumer(): Promise<void> {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: TOPIC, fromBeginning: true });

    console.log(`🚀 Listening to topic "${TOPIC}" as group "${GROUP_ID}"`);

    await consumer.run({
      eachMessage: async ({
        topic,
        partition,
        message,
      }: EachMessagePayload) => {
        const value = message.value?.toString() ?? '';
        console.log(
          `📥 Received [${topic}] | Partition: ${partition} | ${value}`
        );
      },
    });
  } catch (error) {
    console.error('❌ Kafka consumer failed to start:', error);
    process.exit(1);
  }
}

runConsumer();
