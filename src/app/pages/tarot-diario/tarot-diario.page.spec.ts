import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarotDiarioPage } from './tarot-diario.page';

describe('TarotDiarioPage', () => {
  let component: TarotDiarioPage;
  let fixture: ComponentFixture<TarotDiarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarotDiarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
