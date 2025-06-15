import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-salas',
  imports: [CommonModule],
  templateUrl: './salas.html',
  styleUrl: './salas.scss',
})
export class Salas {
  @Input() sidebarOpen: boolean = true;

  userId = 1;
  router = inject(Router);

  chatRooms = [
    { id: 1, name: 'Sala Geral' },
    { id: 2, name: 'Projetos' },
    { id: 3, name: 'TI Interno' },
  ];

  onOpen(nomeSala: string) {


    this.router.navigate(['/admin/chat'], {
      queryParams: {
        nomeSala: nomeSala,
      },
    });
  }
}
