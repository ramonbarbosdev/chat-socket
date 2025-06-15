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
import { formatarDataHora } from '../../utils/FormatoData';
import { formatarInicialNome } from '../../utils/InicialNome';
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
  nomeSalaInicial: string = ''; 
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
      this.nomeSalaInicial = formatarInicialNome(this.nomeSala);

      this.enterRoom(this.nomeSala);
    });
  }

  enterRoom(roomId: string) {
    this.messages = [];

    this.chatService.sendHistory(roomId).subscribe((retorno: Message[]) => {
      this.messages = retorno.map((item: any) => ({
        user: item.id_usuario,
        timestamp: formatarDataHora(item.timestamp),
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



  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
