import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  HlmTabsComponent,
  HlmTabsContentDirective,
  HlmTabsListComponent,
  HlmTabsTriggerDirective,
} from '@spartan-ng/helm/tabs';
import { AmigosUser } from '../../components/amigos-user/amigos-user';
import { Amigo } from 'src/app/models/amigo';
import { AmigosService } from 'src/app/services/amigos.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonModule } from '@angular/common';
import { Eventservice } from 'src/app/services/eventservice';
import { ChatService } from 'src/app/services/chat.service';
import { Dropdown } from '../../components/dropdown/dropdown';
import { HlmLabelDirective } from '@spartan-ng/helm/label';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-amigos',
  imports: [
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    AmigosUser,
    CommonModule,
    Dropdown,
    HlmLabelDirective,
    HlmFormFieldModule,
    HlmButtonDirective,
  ],
  templateUrl: './amigos.html',
  styleUrl: './amigos.scss',
})
export class Amigos implements OnInit {
  public objeto: Amigo = new Amigo();
  pendenteList: Amigo[] = [];
  todosList: Amigo[] = [];
  id_usuario: string = '';
  onlineUserIds: { id: number; nome: string }[] = [];

  usuarioOpcoes: any[] = [];
  usuarioSelecionado = '';

  service = inject(AmigosService);
  private auth = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);
  private eventService = inject(Eventservice);
  private chatService = inject(ChatService);

  ngOnInit(): void {
    this.id_usuario = this.auth.getUser().id_usuario;
    this.buscarAmigosPendentes();
    this.buscarTodosAmigos();
    this.buscarUsuariosOnline();
    this.obterTodosAmigosDisponivel();

    //Atualização entre front
    this.eventService.reloadAmigos$.subscribe(() => {
      this.buscarAmigosPendentes();
      this.buscarTodosAmigos();
      this.buscarUsuariosOnline();
      this.obterTodosAmigosDisponivel();
    });

    //atualização entre o  back e front
    this.chatService.getAmigosUpdates().subscribe(() => {
      this.buscarAmigosPendentes();
      this.buscarTodosAmigos();
      this.buscarUsuariosOnline();
    });
  }

  obterTodosAmigosDisponivel() {
    this.service.obterAmigoDisponivel(this.id_usuario).subscribe({
      next: (res) => {
        this.usuarioOpcoes = res.map((user: any) => ({
          label: user.nome,
          value: String(user.id),
        }));
        this.cdRef.detectChanges();
      },
      error: () => {},
    });
  }

  enviarConvite() {
    if (!this.usuarioSelecionado) return;

    this.service
      .enviarConviteAmigo(this.id_usuario, this.usuarioSelecionado)
      .subscribe({
        next: (res) => {
          this.usuarioSelecionado = '';
        },
        error: () => {},
      });
  }

  buscarUsuariosOnline() {
    this.service.getOnlineUsers(this.id_usuario).subscribe({
      next: (res) => {
        this.onlineUserIds = [...res];
        // console.log('Online atualizado:', this.onlineUserIds);
        this.cdRef.detectChanges();
      },
      error: (e) => {},
    });
  }

  isOnline(item: any): boolean {
    let userId;
    if (this.id_usuario === item?.id_receiver?.id) {
      userId = item?.id_requester?.id;
    } else {
      userId = item?.id_receiver?.id;
    }
    return this.onlineUserIds.some((u) => u.id === userId);
  }

  buscarTodosAmigos() {
    this.service.obterAmigoTodos(this.id_usuario).subscribe({
      next: (res) => {
        this.todosList = res;
        this.cdRef.detectChanges();
      },
      error: (e) => {},
    });
  }

  buscarAmigosPendentes() {
    this.service.obterAmigoPendente(this.id_usuario).subscribe({
      next: (res) => {
        this.pendenteList = res;
        this.cdRef.detectChanges();
      },
      error: (e) => {},
    });
  }
}
