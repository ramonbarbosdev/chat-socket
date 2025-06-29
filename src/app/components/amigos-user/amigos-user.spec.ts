import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmigosUser } from './amigos-user';

describe('AmigosUser', () => {
  let component: AmigosUser;
  let fixture: ComponentFixture<AmigosUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AmigosUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AmigosUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
