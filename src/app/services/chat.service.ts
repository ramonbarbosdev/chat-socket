import { inject, Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { Message } from '../models/message';
import { environment } from '../environment';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { Eventservice } from './eventservice';

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

  private salasSubject = new Subject<void>();
  private amigosSubject = new Subject<void>();
  private salasSubjectDelete = new Subject<string>();

  constructor(private http: HttpClient) {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    const url = `${environment.apiUrlWebSocket}`;

    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(url),
      reconnectDelay: 5000,
      debug: (str) => console.log(),
    });

    this.stompClient.onConnect = (frame) => {
      this.connected = true;
      console.log('Conectado ao WebSocket');

      this.stompClient.subscribe('/topic/salas', () => {
        this.salasSubject.next(); 
      });

      this.stompClient.subscribe('/topic/salas/delete', (retorno) => {
        this.salasSubjectDelete.next(retorno.body);
      });

      this.stompClient.subscribe('/topic/amigos', () => {
        this.amigosSubject.next();
      });

      if (this.currentRoomId) this.subscribeToRoom(this.currentRoomId);
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Erro STOMP: ' + frame.headers['message']);
    };

    this.stompClient.activate();
  }

  getSalasUpdates(): Observable<void> {
    return this.salasSubject.asObservable();
  }

  getSalasUpdatesDelete(): Observable<string> {
    return this.salasSubjectDelete.asObservable();
  }

  getAmigosUpdates(): Observable<void> {
    return this.amigosSubject.asObservable();
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

  sendHistory(roomId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}/history/${roomId}`);
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
