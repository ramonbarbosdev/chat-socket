import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
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
  private eventService = inject(Eventservice);

  ngOnInit(): void
  {
    this.id_usuario = this.auth.getUser().id_usuario;
    this.buscarAmigosPendentes();
    

    
  }

  buscarAmigosPendentes() {

    this.service.obterAmigoPendente(this.id_usuario).subscribe({
      next: (res) => {
        this.pendenteList = res;
      },
      error: (e) => {},
    });

  }
}
