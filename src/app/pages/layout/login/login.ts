import { Component, EventEmitter, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2'
import { InputCustom } from "../../../components/input/input";


@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    HlmButtonDirective,
    InputCustom
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  public objeto = { login: '',  senha: '', };
  router = inject(Router);
  constructor(private auth: AuthService) {}

  logar() {
    console.log(this.objeto);
    this.auth.login(this.objeto).subscribe({
      next: (res: any) => {
        this.auth.setToken(res.Authorization);
        this.router.navigate(['admin/home']);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Login inválido',
          text: 'Login ou senha incorreto',
          confirmButtonText: 'OK',
        });
      },
    });
  }
}
