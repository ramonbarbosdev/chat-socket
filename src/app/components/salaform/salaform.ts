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

  userId: number = 0;

  ngOnInit(): void {
    this.userId = this.auth.getUser().id_usuario ?? null;
  }

  onSave() {
    this.objeto.id_usuario = this.userId;
    console.log(this.objeto);
  }
}
