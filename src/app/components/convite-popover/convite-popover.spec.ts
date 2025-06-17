import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvitePopover } from './convite-popover';

describe('ConvitePopover', () => {
  let component: ConvitePopover;
  let fixture: ComponentFixture<ConvitePopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvitePopover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConvitePopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
