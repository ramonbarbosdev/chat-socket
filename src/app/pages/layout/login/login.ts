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

  // To:do -  colocar processamento enquanto o servidor nao responde:

  logar() {
    this.auth.login(this.objeto).subscribe({
      next: (res: any) => {
        this.auth.setUser(res)
        this.auth.setToken(res.Authorization);
        this.router.navigate(['admin/home']);
      },
      error: (err) => {
        this.tratarErro(err);
      },
    });
  }

  tratarErro(e: any)
  {

    console.log(e)
    const status = e.status ?? null;
    let mensagem = "Login ou senha incorreto"

    if(status == 403)
    {
       mensagem = 'Escopo(s) inválido(s) fornecido(s)';
    }
    else if (status == 0)
    {
      mensagem = 'Sem comunicação com o servidor.';
    }

    Swal.fire({
      icon: 'error',
      title: 'Erro ao efeituar o Login',
      text: mensagem,
      confirmButtonText: 'OK',
    });
  }
}
