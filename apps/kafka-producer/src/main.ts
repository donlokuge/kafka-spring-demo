import { Kafka, Partitioners, Producer } from 'kafkajs';


const KAFKA_BROKERS = (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(',');
const TOPIC = process.env.KAFKA_TOPIC ?? 'test-topic';
const CLIENT_ID = process.env.KAFKA_CLIENT_ID ?? 'producer-app';

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: KAFKA_BROKERS,
});

const producer: Producer = kafka.producer(
    {
        createPartitioner: Partitioners.DefaultPartitioner,
    }
);

async function produceMessages() {
  await producer.connect();

  let count = 0;

  setInterval(async () => {
    const payload = {
      id: count,
      timestamp: new Date().toISOString(),
      message: `Message #${count}`,
    };

    try {
      await producer.send({
        topic: TOPIC,
        messages: [{ value: JSON.stringify(payload) }],
      });

      console.log(`✅ Sent to [${TOPIC}]:`, payload);
      count++;
    } catch (err) {
      console.error('❌ Kafka send error:', err);
    }
  }, 1000);
}

produceMessages().catch((err) => {
  console.error('❌ Kafka producer failed:', err);
  process.exit(1);
});
