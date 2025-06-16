import { Component, inject, OnInit } from '@angular/core';
import {
  BrnSheetContentDirective,
  BrnSheetTriggerDirective,
} from '@spartan-ng/brain/sheet';
import {
  HlmSheetComponent,
  HlmSheetContentComponent,
  HlmSheetDescriptionDirective,
  HlmSheetFooterComponent,
  HlmSheetHeaderComponent,
  HlmSheetTitleDirective,
} from '@spartan-ng/helm/sheet';
import { InputCustom } from "../input/input";
import { Rooms } from '../../models/rooms';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { AuthService } from '../../auth/auth.service';
import { Baseservice } from '../../services/baseservice';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { Roomeventservice } from '../../services/roomeventservice';
@Component({
  selector: 'app-salaform',
  imports: [
    HlmSheetComponent,
    HlmSheetContentComponent,
    HlmSheetDescriptionDirective,
    HlmSheetFooterComponent,
    HlmSheetHeaderComponent,
    HlmSheetTitleDirective,
    BrnSheetContentDirective,
    BrnSheetTriggerDirective,
    HlmButtonDirective,
    InputCustom,
  ],
  templateUrl: './salaform.html',
  styleUrl: './salaform.scss',
})
export class Salaform implements OnInit {
  public objeto: Rooms = new Rooms();
  private auth = inject(AuthService);
  private baseService = inject(Baseservice);
  endpoint = 'room';
  userId: number = 0;
  router = inject(Router);
  private roomEvents = inject(Roomeventservice);

  ngOnInit(): void {
    this.userId = this.auth.getUser().id_usuario ?? null;
  }

  onSave() {
    this.objeto.id_usuario = this.userId;
    this.baseService.cadastrar(this.endpoint, this.objeto).subscribe({
      next: (res: any) => {
        this.roomEvents.emitReloadRoom();
      },
      error: (err) => {},
    });
  }
}
