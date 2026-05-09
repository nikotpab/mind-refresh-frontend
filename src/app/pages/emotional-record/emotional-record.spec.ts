import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmotionalRecord } from './emotional-record';

describe('EmotionalRecord', () => {
  let component: EmotionalRecord;
  let fixture: ComponentFixture<EmotionalRecord>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmotionalRecord],
    }).compileComponents();

    fixture = TestBed.createComponent(EmotionalRecord);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
