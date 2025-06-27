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
import { AuthService } from '../../../auth/auth.service';
import { formatarInicialNome } from '../../../utils/InicialNome';
import { NavMenu } from "../../../components/nav-menu/nav-menu";



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HlmButtonModule,
    HlmIconDirective,
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    NavMenu,
    NgIcon,
  ],
  providers: [provideIcons({ lucidePanelRightClose, lucidePanelLeftClose })],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  private auth = inject(AuthService);
  sidebarOpen = true;
  nm_usuario = '';
  nm_cargo = '';
  nm_inicial = '';

  ngOnInit(): void {
    this.nm_usuario = this.auth.getUser().nm_usuario;
    this.nm_cargo = 'Usuario';
    this.nm_inicial = formatarInicialNome(this.nm_usuario);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  sair() {
    this.auth.logout();
  }
}
