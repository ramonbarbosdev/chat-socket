import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import { InputCustom } from '../../../components/input/input';
import { AuthService } from '../../../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    HlmInputDirective,
    HlmFormFieldModule,
    RouterLink,
    HlmButtonDirective,
    InputCustom,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  public objeto = {
    login: '',
    nome: '',
    senha: '',
    token: '',
  };

  auth = inject(AuthService);

  router = inject(Router);

  cadastrar() {
    this.auth.cadastrar(this.objeto).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Cadastro realizado com sucesso!',
          text: 'Você pode fazer login agora.',
          confirmButtonText: 'OK',
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Cadastro com inconsistências!',
          text: err.error.message,
          confirmButtonText: 'OK',
        });
        
      },
    });
  }
}
