import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanelRightClose, lucidePanelLeftClose } from '@ng-icons/lucide';
import { RouterOutlet } from '@angular/router';
import {
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
  HlmAvatarImageDirective,
} from '@spartan-ng/helm/avatar';
import { Salas } from '../../../components/salas/salas';
import { AuthService } from '../../../auth/auth.service';
import { Salaform } from "../../../components/salaform/salaform";
import { formatarInicialNome } from '../../../utils/InicialNome';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HlmButtonModule,
    HlmIconDirective,
    NgIcon,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    Salas,
    Salaform
],
  providers: [provideIcons({ lucidePanelRightClose, lucidePanelLeftClose })],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  private auth = inject(AuthService);
  sidebarOpen = false;
  nm_usuario = "";
  nm_cargo = "";
  nm_inicial = "";

  ngOnInit(): void {
    this.nm_usuario = this.auth.getUser().nm_usuario;
    this.nm_cargo = "Usuario"
    this.nm_inicial = formatarInicialNome(this.nm_usuario);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  sair() {
    this.auth.logout();
  }
}
