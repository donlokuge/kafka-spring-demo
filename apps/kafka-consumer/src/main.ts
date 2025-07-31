import { Kafka } from 'kafkajs';
import Redis from 'ioredis';
import { ConsumerService, KafkaConsumerOptions } from './services/consumer.service';

const config: KafkaConsumerOptions = {
  topic: process.env.KAFKA_TOPIC ?? 'test-topic',
  redisKey: process.env.REDIS_KEY ?? 'kafka:messages',
  redisMaxLength: parseInt(process.env.REDIS_MAX_LENGTH ?? '100', 10),
};

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID ?? 'consumer-app',
  brokers: (process.env.KAFKA_BROKERS ?? 'localhost:9092').split(','),
});

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const consumer = kafka.consumer({
  groupId: process.env.KAFKA_GROUP_ID ?? 'demo-group',
});

const app = new ConsumerService(consumer, redis, config);

app.start().catch((err) => {
  console.error('❌ Failed to start consumer:', err);
  process.exit(1);
});
