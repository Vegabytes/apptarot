import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrabajosPersonalizadosPage } from './trabajos-personalizados.page';

describe('TrabajosPersonalizadosPage', () => {
  let component: TrabajosPersonalizadosPage;
  let fixture: ComponentFixture<TrabajosPersonalizadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabajosPersonalizadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
