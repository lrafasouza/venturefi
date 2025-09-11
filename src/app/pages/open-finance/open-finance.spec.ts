import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenFinance } from './open-finance';

describe('OpenFinance', () => {
  let component: OpenFinance;
  let fixture: ComponentFixture<OpenFinance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpenFinance]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpenFinance);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
