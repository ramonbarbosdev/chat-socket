import { Component } from '@angular/core';

import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMessageCircle } from '@ng-icons/lucide';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule, NgIcon, HlmIconDirective],
  providers: [provideIcons({ lucideMessageCircle })],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
