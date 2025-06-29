import { Component, inject, OnInit, signal } from '@angular/core';
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
import { Eventservice } from '../../services/eventservice';
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
  private eventService = inject(Eventservice);

  public popoverState = signal<'open' | 'closed'>('closed');

  onPopoverStateChange(state: 'open' | 'closed') {
    this.popoverState.set(state);
  }

  ngOnInit(): void {
    this.userId = this.auth.getUser().id_usuario ?? null;
  }

  onSave() {
    this.objeto.id_usuario = this.userId;
    this.baseService.cadastrar(this.endpoint, this.objeto).subscribe({
      next: (res: any) => {
        this.eventService.emitReloadRoom();
        this.popoverState.set('closed');
      },
      error: (err) => {},
    });
  }
}
