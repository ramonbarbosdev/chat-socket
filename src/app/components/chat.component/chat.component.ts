import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HlmCardContentDirective,
  HlmCardDescriptionDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
  HlmCardTitleDirective,
} from '@spartan-ng/helm/card';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/helm/avatar';

import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-chat.component',
  imports: [
    CommonModule,
    FormsModule,
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
    HlmInputDirective,
    HlmIconDirective,
    NgIcon,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
  ],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  messageInput = '';
  userId: string = '';
  nomeSala: string = '';
  messageList: any[] = [];
  private messageSubscription?: Subscription;

  private auth = inject(AuthService);

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  //TO:DO - implementar cache de armazenamento de conversa por salas
  //TO:DO - diferenciar cada envio um do outro
  //TO:DO - salvar conversas em banco de dados (testar no mongo)

  ngOnInit(): void {
    this.userId = this.auth.getUser().id_usuario;

    this.route.queryParamMap.subscribe((params) => {
      this.nomeSala = params.get('nomeSala') ?? '';
      this.enterRoom(this.nomeSala);
    });
  }

  enterRoom(roomId: string) {
    this.messages = [];

    this.chatService.sendHistory(roomId).subscribe((retorno: Message[]) => {
      this.messages = retorno.map((item: any) => ({
        user: item.id_usuario,
        timestamp: this.parseTimestamp(item.timestamp),
        message: item.message,
      }));
      this.cdr.detectChanges(); // força update do Angular
    });

    this.chatService.subscribeToRoom(roomId);

    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    this.messageSubscription = this.chatService
      .getMessages(roomId)
      .subscribe((msg: Message) => {
        this.messages.push(msg);
        this.cdr.detectChanges();
      });
  }

  sendMessage() {
    const chatmessage: Message = {
      user: this.userId,
      timestamp: new Date(),
      message: this.messageInput.trim(),
    };

    this.chatService.sendMessage(this.nomeSala, chatmessage);
    this.messageInput = '';
  }

  getInitials(name: string): string {
    if (!name) return '';
    const words = name.trim().split(' ');
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0).toUpperCase() +
      words[words.length - 1].charAt(0).toUpperCase()
    );
  }

  getData(stringDeDataInvalida: any): string {
    const data = this.parseTimestamp(stringDeDataInvalida);
    if (!data) return '';
    // Formatar como "dd/MM/yyyy HH:mm"
    const diaF = data.getDate().toString().padStart(2, '0');
    const mesF = (data.getMonth() + 1).toString().padStart(2, '0');
    const anoF = data.getFullYear();
    const horaF = data.getHours().toString().padStart(2, '0');
    const minutoF = data.getMinutes().toString().padStart(2, '0');
    return `${diaF}/${mesF}/${anoF} ${horaF}:${minutoF}`;
  }

  parseTimestamp(stringDeDataInvalida: any): Date {
    const partes = typeof stringDeDataInvalida === 'string'
      ? stringDeDataInvalida.split(',').map(Number)
      : [];
    if (partes.length >= 7) {
      const ano = partes[0];
      const mes = partes[1] - 1; // JavaScript começa do 0
      const dia = partes[2];
      const hora = partes[3];
      const minuto = partes[4];
      const segundo = partes[5];
      const milissegundo = Math.floor(partes[6] / 1000000);
      return new Date(ano, mes, dia, hora, minuto, segundo, milissegundo);
    }
    return new Date();
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
