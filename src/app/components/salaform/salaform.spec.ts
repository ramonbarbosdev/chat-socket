import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salaform } from './salaform';

describe('Salaform', () => {
  let component: Salaform;
  let fixture: ComponentFixture<Salaform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salaform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salaform);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
