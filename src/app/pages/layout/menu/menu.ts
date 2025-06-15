import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
  providers: [provideIcons({ lucidePanelRightClose, lucidePanelLeftClose })],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  private auth = inject(AuthService);
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  sair() {
    this.auth.logout();
  }
}
