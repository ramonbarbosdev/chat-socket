import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-amigos',
  imports: [
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    AmigosUser,
    CommonModule,
  ],
  templateUrl: './amigos.html',
  styleUrl: './amigos.scss',
})
export class Amigos implements OnInit {
  pendenteList: Amigo[] = [];
  todosList: Amigo[] = [];
  id_usuario: string = '';
  onlineUserIds: { id: number; nome: string }[] = [];

  service = inject(AmigosService);
  private auth = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);
  private eventService = inject(Eventservice);

  ngOnInit(): void {
    this.id_usuario = this.auth.getUser().id_usuario;
    this.buscarAmigosPendentes();
    this.buscarTodosAmigos();
    this.buscarUsuariosOnline();

    this.eventService.reloadAmigos$.subscribe(() => {
      this.buscarAmigosPendentes();
      this.buscarTodosAmigos();
      this.buscarUsuariosOnline();
    });
  }

  buscarUsuariosOnline() {
    this.service.getOnlineUsers(this.id_usuario).subscribe({
      next: (res) => {
        this.onlineUserIds = res;
        this.cdRef.detectChanges();
      },
      error: (e) => {},
    });
  }

  isOnline(item: any): boolean {
    let userId;
    if (this.id_usuario === item?.id_receiver?.id)
      {
     userId = item?.id_requester?.id 

      } 
      else{
         userId = item?.id_receiver?.id;

      }
      // console.log(this.onlineUserIds.some((u) => u.id === userId));
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
