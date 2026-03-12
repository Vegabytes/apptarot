import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarotDiarioDetallePage } from './tarot-diario-detalle.page';

describe('TarotDiarioDetallePage', () => {
  let component: TarotDiarioDetallePage;
  let fixture: ComponentFixture<TarotDiarioDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarotDiarioDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
