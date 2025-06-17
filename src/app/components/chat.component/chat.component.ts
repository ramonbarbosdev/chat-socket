import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Message } from '../../models/message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
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
import { Baseservice } from '../../services/baseservice';
import { Dropdown } from "../dropdown/dropdown";
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import { HlmButtonDirective } from '@spartan-ng/helm/button';



@Component({
  selector: 'app-chat.component',
  imports: [
    CommonModule,
    FormsModule,
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmInputDirective,
    HlmIconDirective,
    NgIcon,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    Caixachat,
    Dropdown,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    HlmButtonDirective,
  ],
  standalone: true,
  providers: [provideIcons({ lucideSearch })],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent implements OnInit, AfterViewInit {
  messages: Message[] = [];
  messageInput = '';
  userId: string = '';
  id_room: string = '';
  nm_room: string = '';
  nomeSalaInicial: string = '';
  messageList: any[] = [];
  private messageSubscription?: Subscription;

  private auth = inject(AuthService);
  private basService = inject(Baseservice);
  private nomeCache = new Map<string, string>();

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  usuarioOpcoes: any[] = [];

  usuarioSelecionado = '';

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

  ngOnInit(): void {
    this.userId = this.auth.getUser().id_usuario;

    this.route.queryParamMap.subscribe((params) => {
      this.id_room = params.get('id_room') ?? '';
      this.nm_room = params.get('nm_room') ?? '';
      this.nomeSalaInicial = formatarInicialNome(this.nm_room);

      this.enterRoom(this.id_room);
    });
  }

  enviarConvite()
  {
    console.log(this.usuarioSelecionado);
    if(!this.usuarioSelecionado) return;
    
  }

  enterRoom(roomId: string) {
    this.messages = [];

    this.processarHistorico();
    this.chatService.subscribeToRoom(this.id_room);

    if (this.messageSubscription) this.messageSubscription.unsubscribe();

    this.processarMensagem();
  }

  sendMessage() {
    const chatmessage: Message = {
      id_chatmessage: 0,
      id_usuario: this.userId,
      timestamp: new Date(),
      message: this.messageInput.trim(),
      nm_usuario: '',
      id_room: '',
    };

    this.chatService.sendMessage(this.id_room, chatmessage);
    this.messageInput = '';
  }

  processarHistorico() {
    this.chatService.sendHistory(this.id_room).subscribe((res: any[]) => {
      if (!res || res.length === 0) return;

      this.messages = res.map((item: any) => ({
        id_chatmessage: item.id_chatmessage,
        id_usuario: item.id_usuario,
        timestamp: formatarDataHora(item.timestamp),
        message: item.message,
        nm_usuario: '',
        id_room: item.id_room,
      }));

      this.messages.forEach((msg) => {
        this.obterNomeUsuario(msg.id_usuario);
      });

      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  processarMensagem() {
    this.messageSubscription = this.chatService
      .getMessages(this.id_room)
      .subscribe((res: Message) => {
        const jaExiste = this.messages.some(
          (m) => m.id_chatmessage === res.id_chatmessage
        );

        if (!jaExiste) {
          this.messages.push({
            id_chatmessage: res.id_chatmessage,
            id_usuario: res.id_usuario,
            timestamp: formatarDataHora(res.timestamp),
            message: res.message,
            nm_usuario: '',
            id_room: res.id_room,
          });
          this.obterNomeUsuario(res.id_usuario);
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  convidarUsuario()
  {
    
  }

  obterTodosUsuario()
  {
    this.basService.obterTodos("usuario").subscribe({
      next: (res) => {
        this.usuarioOpcoes = res.map((user: any) => ({
          label: user.userNome,
          value: String(user.userId),
        }));
        this.cdr.detectChanges();
      },
      error: () => {
        
      },
    });
  }

  obterNomeUsuario(id_usuario: string): void {
    if (this.nomeCache.has(id_usuario)) {
      this.atualizarNomeUsuario(id_usuario, this.nomeCache.get(id_usuario)!);
      return;
    }

    this.basService.obterNomeUsuario(id_usuario).subscribe({
      next: (nome) => {
        this.nomeCache.set(id_usuario, nome);
        this.atualizarNomeUsuario(id_usuario, nome);
      },
      error: () => {
        this.atualizarNomeUsuario(id_usuario, 'Usuário');
      },
    });
  }

  private atualizarNomeUsuario(id_usuario: string, nome: string) {
    const msgs = this.messages.filter(
      (m) => m.id_usuario === id_usuario && !m.nm_usuario
    );
    msgs.forEach((msg) => (msg.nm_usuario = nome));
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.messageSubscription?.unsubscribe();
  }
}
