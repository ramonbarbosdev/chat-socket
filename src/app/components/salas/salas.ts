import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-salas',
  imports: [RouterLink, CommonModule],
  templateUrl: './salas.html',
  styleUrl: './salas.scss',
})
export class Salas {
  @Input() sidebarOpen: boolean = true;

  userId = 1;

  chatRooms = [
    { id: 1, name: 'Sala Geral' },
    { id: 2, name: 'Projetos' },
    { id: 3, name: 'TI Interno' },
  ];
}
