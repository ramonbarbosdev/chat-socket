import { ChangeDetectorRef, Component, Inject, inject, Input, signal } from '@angular/core';
import { Dropdown } from '../dropdown/dropdown';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import {
  HlmCardContentDirective,
  HlmCardDirective,
  HlmCardFooterDirective,
  HlmCardHeaderDirective,
} from '@spartan-ng/helm/card';
import { AuthService } from '../../auth/auth.service';
import { Baseservice } from '../../services/baseservice';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { ConviteService } from '../../services/convite.service';

@Component({
  selector: 'app-convite-popover',
  imports: [
    Dropdown,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    BrnPopoverContentDirective,
    HlmCardContentDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmButtonDirective,
  ],
  templateUrl: './convite-popover.html',
  styleUrl: './convite-popover.scss',
})
export class ConvitePopover {
  @Input() id_room: any;
  @Input() id_usuariologado: any;
  usuarioOpcoes: any[] = [];

  usuarioSelecionado = '';

  private auth = inject(AuthService);
  private conviteService = inject(ConviteService);
  private cdr = inject(ChangeDetectorRef);
  endpoint = "room"
  public popoverState = signal<'open' | 'closed'>('closed');

  onPopoverStateChange(state: 'open' | 'closed') {
    this.popoverState.set(state);
  }

  fecharPopover() {
    this.popoverState.set('closed');
  }

  enviarConvite() {
    if (!this.usuarioSelecionado) return;
    const id_usuario = this.usuarioSelecionado;
    if (this.id_usuariologado == id_usuario)
      return console.log('Voce nao pode convidar a si mesmo');

    //Fazer validacao de usuario que ja estão na sala
    this.conviteService.enviarConviteSala(this.id_room, id_usuario).subscribe({
      next: (res) => {},
      error: () => {},
    });
  }

  obterTodosUsuario() {

    let id_usuario = this.auth.getUser().id_usuario;
    this.conviteService
      .obterUsuarioDisponivel(this.id_room, id_usuario)
      .subscribe({
        next: (res) => {
          console.log(res)
          this.usuarioOpcoes = res.map((user: any) => ({
            label: user.userNome,
            value: String(user.userId),
          }));
          this.cdr.detectChanges();
        },
        error: () => {},
      });
  }
}
