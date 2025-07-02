import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  HlmAvatarImageDirective,
  HlmAvatarComponent,
  HlmAvatarFallbackDirective,
} from '@spartan-ng/helm/avatar';

import { BrnSeparatorComponent } from '@spartan-ng/brain/separator';
import { formatarInicialNome } from 'src/app/utils/InicialNome';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideEllipsisVertical,
  lucideCheck,
  lucideMessageCircle,
} from '@ng-icons/lucide';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { CommonModule } from '@angular/common';
import { AmigosService } from 'src/app/services/amigos.service';
import Swal from 'sweetalert2';
import { Eventservice } from 'src/app/services/eventservice';
import { BrnMenuTriggerDirective } from '@spartan-ng/brain/menu';
import {
  HlmMenuComponent,
  HlmMenuGroupComponent,
  HlmMenuItemDirective,
  HlmMenuLabelComponent,
  HlmMenuSeparatorComponent,
} from '@spartan-ng/helm/menu';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-amigos-user',
  imports: [
    HlmAvatarImageDirective,
    HlmAvatarComponent,
    HlmAvatarFallbackDirective,
    BrnSeparatorComponent,
    HlmIconDirective,
    NgIcon,
    HlmButtonDirective,
    CommonModule,
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    BrnMenuTriggerDirective,
  ],
  providers: [
    provideIcons({ lucideEllipsisVertical, lucideCheck, lucideMessageCircle }),
  ],
  templateUrl: './amigos-user.html',
  styleUrl: './amigos-user.scss',
})
export class AmigosUser implements OnInit {
  @Input() model: any;
  @Input() online: boolean | undefined;

  nm_inicial!: '';
  nm_usuario!: '';
  id_usuario!: string;
  id_friendship!: string;
  tp_status!: string;

  service = inject(AmigosService);
  eventService = inject(Eventservice);
  private auth = inject(AuthService);

  ngOnInit(): void {
    if (this.model) {
      if (this.model.id_receiver.id === this.auth.getUser().id_usuario) {
        this.id_usuario = this.model.id_requester.id;
        this.nm_usuario = this.model.id_requester.nome;
      } else {
        this.id_usuario = this.model.id_receiver.id;
        this.nm_usuario = this.model.id_receiver.nome;
      }
      this.tp_status = this.model.tp_status;
      this.nm_inicial = formatarInicialNome(this.nm_usuario);
      this.id_friendship = this.model.id_friendship;
    }
  }

  aceitarConvite() {
    if (!this.id_usuario) return;
    if (!this.id_friendship) return;

    this.service.aceitarConvite(this.id_usuario, this.id_friendship).subscribe({
      next: (res) => {
        this.eventService.emitReloadAmigos();
        Swal.fire({
          icon: 'success',
          title: res.message,
          text: '',
          confirmButtonText: 'OK',
        });
      },
      error: (e) => {},
    });
  }

  rejeitarConvite() {
    if (!this.id_usuario) return;
    if (!this.id_friendship) return;

    this.service.recusarConvite(this.id_usuario, this.id_friendship).subscribe({
      next: (res) => {
        this.eventService.emitReloadAmigos();
        Swal.fire({
          icon: 'success',
          title: res.message,
          text: '',
          confirmButtonText: 'OK',
        });
      },
      error: (e) => {},
    });
  }

  removerAmizade() {
    if (!this.id_usuario) return;
    if (!this.id_friendship) return;

    this.service.remover(this.id_friendship).subscribe({
      next: (res) => {
        this.eventService.emitReloadAmigos();
        Swal.fire({
          icon: 'success',
          title: res.message,
          text: '',
          confirmButtonText: 'OK',
        });
      },
      error: (e) => {},
    });
  }
}
