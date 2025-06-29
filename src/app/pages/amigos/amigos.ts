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

  service = inject(AmigosService);
  private auth = inject(AuthService);
  private cdRef = inject(ChangeDetectorRef);
  private eventService = inject(Eventservice);

  ngOnInit(): void {
    this.id_usuario = this.auth.getUser().id_usuario;
    this.buscarAmigosPendentes();
    this.buscarTodosAmigos();

    this.eventService.reloadAmigos$.subscribe(() => {
      this.buscarAmigosPendentes();
      this.buscarTodosAmigos();
    });
  }

  buscarTodosAmigos() {
    this.service.obterAmigoTodos(this.id_usuario).subscribe({
      next: (res) => {
        console.log(res);
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
