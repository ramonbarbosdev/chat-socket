import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-caixachat',
  imports: [CommonModule],
  templateUrl: './caixachat.html',
  styleUrl: './caixachat.scss',
})
export class Caixachat {
  @Input() objeto: any;
  @Input() isLogado: boolean | undefined;
}
