import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  // Injecting the client using the correct token
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  async emit(topic: string, message: any) {
    await this.client.emit(topic, message).toPromise();
  }

  async send(topic: string, message: any) {
    return this.client.send(topic, message).toPromise();
  }
}
