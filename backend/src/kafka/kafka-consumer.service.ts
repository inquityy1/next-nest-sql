// import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Consumer, Kafka, EachMessagePayload } from 'kafkajs';
// import { MessagesService } from '../chat/chat.service'; // Import your MessagesService

// @Injectable()
// export class KafkaConsumerService implements OnModuleInit {
//   private readonly kafka: Kafka;
//   private readonly consumer: Consumer;

//   constructor(private readonly messagesService: MessagesService) {
//     this.kafka = new Kafka({
//       brokers: ['kafka:9092'], // Kafka broker URL (matches your Docker Compose)
//       clientId: 'nestjs-consumer-client',
//     });

//     this.consumer = this.kafka.consumer({ groupId: 'nestjs-consumer-group' });
//   }

//   async onModuleInit() {
//     // Connect the consumer to Kafka
//     await this.consumer.connect();

//     // Subscribe to the topic (replace 'chat-topic' with your actual topic)
//     await this.consumer.subscribe({ topic: 'chat-topic', fromBeginning: true });

//     // Start consuming messages
//     await this.consumer.run({
//       eachMessage: async (payload: EachMessagePayload) => {
//         await this.handleMessage(payload);
//       },
//     });

//     console.log('Kafka Consumer Service is listening for messages...');
//   }

//   async handleMessage(payload: EachMessagePayload): Promise<void> {
//     const message = JSON.parse(payload.message.value.toString());
//     const { sender, receiver, content } = message;

//     // Use MessagesService to handle saving the message
//     await this.messagesService.saveMessage(sender, receiver, content);
//   }

//   async disconnect(): Promise<void> {
//     await this.consumer.disconnect();
//   }
// }
