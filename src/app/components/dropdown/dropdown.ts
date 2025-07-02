

import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { BrnCommandImports } from '@spartan-ng/brain/command';
import { HlmCommandImports } from '@spartan-ng/helm/command';
import { HlmIconDirective } from '@spartan-ng/helm/icon';
import { HlmButtonDirective } from '@spartan-ng/helm/button';
import {
  BrnPopoverComponent,
  BrnPopoverContentDirective,
  BrnPopoverTriggerDirective,
} from '@spartan-ng/brain/popover';
import { HlmPopoverContentDirective } from '@spartan-ng/helm/popover';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronsUpDown,
  lucideCheck,
  lucideSearch,
} from '@ng-icons/lucide';
import { CommonModule } from '@angular/common';

type Framework = { label: any; value: any };

@Component({
  selector: 'app-dropdown',
  imports: [
    CommonModule,
    BrnCommandImports,
    HlmCommandImports,
    HlmIconDirective,
    HlmButtonDirective,
    BrnPopoverComponent,
    BrnPopoverTriggerDirective,
    HlmPopoverContentDirective,
    BrnPopoverContentDirective,
  ],
  providers: [
    provideIcons({ lucideChevronsUpDown, lucideSearch, lucideCheck }),
  ],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
})
export class Dropdown {
  @Input() options: Framework[] = [];
  @Input() selected: string = '';
  @Input() placeholder: string = 'Selecione uma opção';
  @Output() selectedChange = new EventEmitter<string>();
  @Input() width: string = 'w-6/6';

  public state = signal<'closed' | 'open'>('closed');

  stateChanged(state: 'open' | 'closed') {
    this.state.set(state);
  }

  get selectedItem(): Framework | undefined {
    return this.options.find((opt) => opt.value === this.selected);
  }

  commandSelected(framework: Framework) {
    this.state.set('closed');
    if (this.selected === framework.value) {
      this.selected = '';
      this.selectedChange.emit('');
    } else {
      this.selected = framework.value;
      this.selectedChange.emit(this.selected);
    }
  }
}
