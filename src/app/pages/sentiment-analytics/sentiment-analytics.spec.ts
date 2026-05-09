import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentAnalytics } from './sentiment-analytics';

describe('SentimentAnalytics', () => {
  let component: SentimentAnalytics;
  let fixture: ComponentFixture<SentimentAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SentimentAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(SentimentAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
