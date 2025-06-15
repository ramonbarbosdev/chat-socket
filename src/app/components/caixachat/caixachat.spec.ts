import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Caixachat } from './caixachat';

describe('Caixachat', () => {
  let component: Caixachat;
  let fixture: ComponentFixture<Caixachat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Caixachat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Caixachat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
