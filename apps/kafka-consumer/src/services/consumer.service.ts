import { Consumer, EachMessagePayload } from 'kafkajs';
import Redis from 'ioredis';

export interface KafkaConsumerOptions {
  topic: string;
  redisKey: string;
  redisMaxLength: number;
}

export class ConsumerService {
  private readonly consumer: Consumer;
  private readonly redis: Redis;
  private readonly options: KafkaConsumerOptions;

  constructor(consumer: Consumer, redis: Redis, options: KafkaConsumerOptions) {
    this.consumer = consumer;
    this.redis = redis;
    this.options = options;
  }

  private async handleMessage({
    topic,
    partition,
    message,
  }: EachMessagePayload): Promise<void> {
    const value = message.value?.toString() ?? '';

    const entry = {
      topic,
      partition,
      offset: message.offset,
      timestamp: message.timestamp,
      value,
    };

    try {
      await this.redis.lpush(this.options.redisKey, JSON.stringify(entry));
      await this.redis.ltrim(
        this.options.redisKey,
        0,
        this.options.redisMaxLength - 1
      );
      console.log(`📥 Stored message from topic "${topic}":`, entry);
    } catch (error) {
      console.error('❌ Failed to store message in Redis:', error);
    }
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.options.topic,
      fromBeginning: true,
    });

    console.log(`🚀 Listening to Kafka topic "${this.options.topic}"...`);

    await this.consumer.run({
      eachMessage: this.handleMessage.bind(this),
    });
  }

  public async stop(): Promise<void> {
    await this.consumer.disconnect();
    await this.redis.quit();
    console.log('🛑 Consumer and Redis disconnected.');
  }
}
