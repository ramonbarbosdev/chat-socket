import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
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
import { formatarDataHora } from '../../utils/FormatoData';
import { formatarInicialNome } from '../../utils/InicialNome';
import { Caixachat } from "../caixachat/caixachat";
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
    Caixachat,
  ],
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
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

  @ViewChild('messageContainer') messageContainer?: ElementRef;

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100); 
  }

  //TO:DO - diferenciar cada envio um do outro

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
        id_chatmessage: item.id_chatmessage,
        id_usuario: item.id_usuario,
        timestamp: formatarDataHora(item.timestamp),
        message: item.message,
        nm_usuario: '',
        roomId: '',
      }));
      console.log('historico');
      this.cdr.detectChanges(); // força update do Angular
    });

    this.chatService.subscribeToRoom(roomId);

    if (this.messageSubscription) this.messageSubscription.unsubscribe();

    this.messageSubscription = this.chatService
      .getMessages(roomId)
      .subscribe((retorno: Message) => {
        const jaExiste = this.messages.some(
          (m) => m.id_chatmessage === retorno.id_chatmessage
        );

        if (!jaExiste) {
          this.messages.push({
            id_chatmessage: retorno.id_chatmessage,
            id_usuario: retorno.id_usuario,
            timestamp: formatarDataHora(retorno.timestamp),
            message: retorno.message,
            nm_usuario: '',
            roomId: '',
          });
          console.log('envio');
          this.cdr.detectChanges();
        }
      });
      this.scrollToBottom();
  }

  sendMessage() {
    const chatmessage: Message = {
      id_chatmessage: 0,
      id_usuario: this.userId,
      timestamp: new Date(),
      message: this.messageInput.trim(),
      nm_usuario: '',
      roomId: '',
    };

    this.chatService.sendMessage(this.nomeSala, chatmessage);
    this.messageInput = '';
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
