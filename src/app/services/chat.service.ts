import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private stompClient!: Client;
  private connected: boolean = false;
  private messageSubject = new Subject<Message>();
  private currentRoomId: string | null = null;

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    const url = `${environment.apiUrlWebSocket}/chat-socket`;
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: (str) => console.log(),
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      console.log('Conectado ao WebSocket');
      if (this.currentRoomId)    this.subscribeToRoom(this.currentRoomId);
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
      console.log(parsed)
      this.messageSubject.next(parsed);
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

  getMessages(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
    }
  }
}
