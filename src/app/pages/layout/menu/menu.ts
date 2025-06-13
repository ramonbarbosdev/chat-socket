import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HlmButtonModule } from '@spartan-ng/helm/button';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePanelRightClose, lucidePanelLeftClose } from '@ng-icons/lucide';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    HlmButtonModule,
    HlmIconDirective,
    NgIcon,
  ],
  providers: [provideIcons({ lucidePanelRightClose, lucidePanelLeftClose })],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
