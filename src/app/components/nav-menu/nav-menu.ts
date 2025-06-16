import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { Salas } from "../salas/salas";
import { Router } from '@angular/router';
import { Baseservice } from '../../services/baseservice';
import { Rooms } from '../../models/rooms';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-nav-menu',
  imports: [CommonModule, BrnCommandImports, HlmCommandImports, Salas],
  templateUrl: './nav-menu.html',
  styleUrl: './nav-menu.scss',
})
export class NavMenu {
  @Input() sidebarOpen: boolean = true;

  router = inject(Router);
  baseService = inject(Baseservice);
  private auth = inject(AuthService);
  
  endpoint = 'room';
  public objetos: Rooms[] | any = [];

  ngOnInit(): void {
    this.obterTodasSalas();
  }

  obterTodasSalas() {
    this.baseService.obterTodos(this.endpoint).subscribe({
      next: (res) => {
        // console.log(res);
        this.objetos = res;
      },
      error: () => {},
    });
  }

  onOpen(id_room: number, nm_room: string) {
    this.router.navigate(['/admin/chat'], {
      queryParams: {
        id_room: id_room,
        nm_room: nm_room,
      },
    });
  }

  sair() {
    this.auth.logout();
  }
}
