import { inject, Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient!: Client;
  private connected: boolean = false;
  private messageSubject = new Subject<Message>();
  private currentRoomId: string | null = null;
  private salas = new Map<string, Subject<Message>>();
  private auth = inject(AuthService);

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    // const url = `${environment.apiUrlWebSocket}`;
    let token = this.auth.getToken();

    const url = `${environment.apiUrlWebSocket}?token=${token}`;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: (str) => console.log(),
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      console.log('Conectado ao WebSocket');
      if (this.currentRoomId) this.subscribeToRoom(this.currentRoomId);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erro STOMP: ' + frame.headers['message']);
    };

    this.stompClient.activate();
  }

  subscribeToRoom(roomId: string) {
    if (!this.connected) {
      this.currentRoomId = roomId;
    } else {
      this.currentRoomId = roomId;
      this.stompClient.subscribe(`/topic/${roomId}`, (message) => {
        const parsed: Message = JSON.parse(message.body);
        // this.messageSubject.next(parsed);
        this.salas.get(roomId)?.next(parsed);
      });
    }
  }

  sendMessage(roomId: string, message: Message) {
    if (this.connected) {
      this.stompClient.publish({
        destination: `/app/chat/${roomId}`,
        body: JSON.stringify(message),
      });
    } else {
      console.error('WebSocket não está conectado.');
    }
  }

  getMessages(roomId: string): Observable<Message> {
    if (!this.salas.has(roomId)) {
      this.salas.set(roomId, new Subject<Message>());
    }
    return this.salas.get(roomId)!.asObservable();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
    }
  }
}
