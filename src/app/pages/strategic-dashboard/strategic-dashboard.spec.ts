import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicDashboard } from './strategic-dashboard';

describe('StrategicDashboard', () => {
  let component: StrategicDashboard;
  let fixture: ComponentFixture<StrategicDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategicDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
