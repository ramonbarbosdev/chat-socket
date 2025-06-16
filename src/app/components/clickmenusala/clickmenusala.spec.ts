import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Clickmenusala } from './clickmenusala';

describe('Clickmenusala', () => {
  let component: Clickmenusala;
  let fixture: ComponentFixture<Clickmenusala>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clickmenusala]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clickmenusala);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
