import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Baseservice } from '../../services/baseservice';
import { Rooms } from '../../models/rooms';

@Component({
  selector: 'app-salas',
  imports: [CommonModule],
  templateUrl: './salas.html',
  styleUrl: './salas.scss',
})
export class Salas implements OnInit {
  @Input() sidebarOpen: boolean = true;

  router = inject(Router);
  baseService = inject(Baseservice);
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

  onOpen(id_room: number, nm_room:string) {
    this.router.navigate(['/admin/chat'], {
      queryParams: {
        id_room: id_room,
        nm_room: nm_room,
      },
    });
  }
}
