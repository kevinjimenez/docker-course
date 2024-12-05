import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { NewMessageDto } from './dto/new-message.dto';
import { MessageWsService } from './message-ws.service';

@WebSocketGateway({
  cors: true,
})
export class MessageWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    // console.log(`cliente conectado ${client.id}`);
    // console.log(client);
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messageWsService.registerCliente(client, payload.id);
    } catch (e) {
      client.disconnect();
      return;
    }

    // console.log({ payload });
    // console.log({ conectados: this.messageWsService.getConnectedClients() });
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket): any {
    // console.log(`cliente desconectado ${client.id}`);
    this.messageWsService.removeCliente(client.id);
    this.wss.emit(
      'clients-updated',
      this.messageWsService.getConnectedClients(),
    );
  }

  @SubscribeMessage('message-from-client')
  // handleMessageFromClient(){}
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    // console.log(client.id, payload);
    //! emite unicamente al cliente
    // client.emit('message-from-server', {
    //   fullName: 'yop',
    //   message: payload.message || 'no-message!!',
    // });

    //! emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'yop',
    //   message: payload.message || 'no-message!!',
    // });

    //! emitir a todos incluyendo al cliente inicial
    this.wss.emit('message-from-server', {
      fullName: this.messageWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!',
    });
  }
}
