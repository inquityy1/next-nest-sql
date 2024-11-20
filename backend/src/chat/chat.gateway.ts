import { Server, Socket } from 'socket.io';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagesService } from './chat.service';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeUsers: Record<string, string> = {}; // Socket ID -> Username mapping

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    delete this.activeUsers[client.id];
    this.server.emit('updateActiveUsers', Object.values(this.activeUsers));
  }

  @SubscribeMessage('register')
  registerUser(
    @MessageBody() username: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.activeUsers[client.id] = username;
    this.server.emit('updateActiveUsers', Object.values(this.activeUsers));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: { to: string; from: string; message: string },
  ) {
    const { to } = data;

    await this.messagesService.createMessage(data);

    const recipientSocketId = Object.keys(this.activeUsers).find(
      (key) => this.activeUsers[key] === to,
    );
    if (recipientSocketId) {
      this.server.to(recipientSocketId).emit('receiveMessage', data);
    }
  }
}
