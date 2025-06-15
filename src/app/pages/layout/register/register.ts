import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmFormFieldModule } from '@spartan-ng/helm/form-field';
import { HlmInputDirective } from '@spartan-ng/helm/input';
import { HlmButtonDirective } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-register',
  imports: [HlmInputDirective,HlmFormFieldModule, RouterLink,HlmButtonDirective  ],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {

}
