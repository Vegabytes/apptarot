import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },

  {
    path: 'inicio',
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule)
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule)
  },
  {
    path: 'tarot-diario',
    loadChildren: () => import('./pages/tarot-diario/tarot-diario.module').then( m => m.TarotDiarioPageModule)
  },
  {
    path: 'tarot-preguntas',
    loadChildren: () => import('./pages/tarot-preguntas/tarot-preguntas.module').then( m => m.TarotPreguntasPageModule)
  },
  {
    path: 'tarot-horoscopo',
    loadChildren: () => import('./pages/tarot-horoscopo/tarot-horoscopo.module').then( m => m.TarotHoroscopoPageModule)
  },
  {
    path: 'tarot-diario-detalle',
    loadChildren: () => import('./pages/tarot-diario-detalle/tarot-diario-detalle.module').then( m => m.TarotDiarioDetallePageModule)
  },
  {
    path: 'resultados',
    loadChildren: () => import('./pages/resultados/resultados.module').then( m => m.ResultadosPageModule)
  },
  {
    path: 'resultados-chatgpt',
    loadChildren: () => import('./pages/resultados-chatgpt/resultados-chatgpt.module').then( m => m.ResultadosChatgptPageModule)
  },
  {
    path: 'politicas',
    loadChildren: () => import('./pages/politicas/politicas.module').then( m => m.PoliticasPageModule)
  },  {
    path: 'trabajos-personalizados',
    loadChildren: () => import('./pages/trabajos-personalizados/trabajos-personalizados.module').then( m => m.TrabajosPersonalizadosPageModule)
  },
  {
    path: 'list-horoscopo',
    loadChildren: () => import('./pages/list-horoscopo/list-horoscopo.module').then( m => m.ListHoroscopoPageModule)
  },
  {
    path: 'offline',
    loadChildren: () => import('./pages/offline/offline.module').then( m => m.OfflinePageModule)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
