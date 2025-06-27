import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { Router } from '@angular/router';
import { Baseservice } from '../../services/baseservice';
import { Rooms } from '../../models/rooms';
import { AuthService } from '../../auth/auth.service';
import { Salaform } from '../salaform/salaform';

import { Roomeventservice } from '../../services/roomeventservice';
import { RoomService } from '../../services/room.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import {
  lucideLogOut,
  lucideCircleFadingPlus,
  lucideCalendar,
  lucideBox,
} from '@ng-icons/lucide';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-nav-menu',
  imports: [
    CommonModule,
    BrnCommandImports,
    HlmCommandImports,
    Salaform,
    NgIcon,
    HlmIconDirective,
  ],
  providers: [
    provideIcons({
      lucideLogOut,
      lucideCircleFadingPlus,
      lucideCalendar,
      lucideBox,
    }),
  ],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.scss',
})
export class NavMenu implements OnInit {
  @Input() sidebarOpen: boolean = true;
  @Output() closeSidebar = new EventEmitter<void>();

  router = inject(Router);
  baseService = inject(Baseservice);
  private auth = inject(AuthService);
  private roomEvents = inject(Roomeventservice);
  private cdRef = inject(ChangeDetectorRef);
  private roomService = inject(RoomService);
  private chatService = inject(ChatService);
  id_usuario!: number;

  endpoint = 'room';
  public objetos: Rooms[] | any = [];
  invite: any;
  menu: any;

  ngOnInit(): void {
    this.carregarSalas();
    this.id_usuario = this.auth.getUser().id_usuario;
    this.roomEvents.reload$.subscribe(() => this.carregarSalas());

    //ouvir o back quando deletar
    this.chatService.getSalasUpdates().subscribe(() => {
      this.carregarSalas();
      this.router.navigate(['/admin/home']);
    });
  }



  carregarSalas() {
    this.baseService
      .obterPorId(
        this.endpoint + '/salas-permitidas',
        this.auth.getUser().id_usuario
      )
      .subscribe({
        next: (res) => {
          this.objetos = res;
          this.cdRef.detectChanges();
        },
        error: () => {},
      });
  }

  entrarSala(item: any) {
    this.router.navigate(['/admin/chat'], {
      queryParams: {
        id_room: item.id_room,
      },
    });
    this.closeSidebar.emit();
  }

  async sairSala(id_room: number) {
    const fl_responsavel = await this.verificarResponsavel(id_room);
    if (fl_responsavel) {
      this.excluirSala(id_room);
    } else {
      await this.removerUsuarioSala(id_room);
    }
    this.closeSidebar.emit();
  }

  async verificarResponsavel(id_room: number): Promise<boolean> {
    try {
      const res: any = await this.roomService
        .verificarResponsavelSala(String(this.id_usuario), String(id_room))
        .toPromise();

      return res.fl_responsavel;
    } catch (err) {
      console.error('Erro ao verificar responsável', err);
      return false;
    }
  }

  async removerUsuarioSala(id_room: number) {
    this.roomService
      .removerUsuario(String(this.id_usuario), String(id_room))
      .subscribe({
        next: (res: any) => {
          this.carregarSalas();
          this.router.navigate(['/admin/home']);
        },
        error: (err) => {},
      });
  }

  excluirSala(id_room: number) {
    this.baseService.deletar(this.endpoint, id_room).subscribe({
      next: (res: any) => {
        this.carregarSalas();
        this.router.navigate(['/admin/home']);
      },
      error: (err) => {},
    });
  }

  sair() {
    this.auth.logout();
  }

  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  public itemSelecionado: any = null;

  onRightClick(event: MouseEvent, objeto: any) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
    this.itemSelecionado = objeto;
  }

  closeContextMenu() {
    this.contextMenuVisible = false;
    this.itemSelecionado = null;
  }
}
