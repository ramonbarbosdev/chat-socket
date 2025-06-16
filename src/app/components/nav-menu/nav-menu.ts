import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { Salas } from "../salas/salas";
import { Router } from '@angular/router';
import { Baseservice } from '../../services/baseservice';
import { Rooms } from '../../models/rooms';
import { AuthService } from '../../auth/auth.service';
import { Salaform } from '../salaform/salaform';
import { Clickmenusala } from "../clickmenusala/clickmenusala";

import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuItemIconDirective,
  HlmMenuItemSubIndicatorComponent,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
  HlmMenuShortcutComponent,
  HlmSubMenuComponent,
} from '@spartan-ng/helm/menu';
import { Roomeventservice } from '../../services/roomeventservice';

@Component({
  selector: 'app-nav-menu',
  imports: [
    CommonModule,
    BrnCommandImports,
    HlmCommandImports,
    Salaform,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent,
    BrnMenuTriggerDirective,
  ],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.scss',
})
export class NavMenu implements OnInit {
  @Input() sidebarOpen: boolean = true;

  router = inject(Router);
  baseService = inject(Baseservice);
  private auth = inject(AuthService);
  private roomEvents = inject(Roomeventservice);
  private cdRef = inject(ChangeDetectorRef);

  endpoint = 'room';
  public objetos: Rooms[] | any = [];
  invite: any;
  menu: any;

  ngOnInit(): void {
    this.obterTodasSalas();
    this.roomEvents.reload$.subscribe(() => this.obterTodasSalas());
  }

  obterTodasSalas() {
    this.baseService.obterTodos(this.endpoint).subscribe({
      next: (res) => {
        this.objetos = res;
        this.cdRef.detectChanges();
      },
      error: () => {},
    });
  }

  entrarSala(id_room: number, nm_room: string) {
    this.router.navigate(['/admin/chat'], {
      queryParams: {
        id_room: id_room,
        nm_room: nm_room,
      },
    });
  }

  excluirSala(id_room: number) {
    this.baseService.deletar(this.endpoint, id_room).subscribe({
      next: (res: any) => {
        this.obterTodasSalas();
        this.router.navigate(['/admin/home'])
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
