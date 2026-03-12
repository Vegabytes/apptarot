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
    loadChildren: () => import('./pages/inicio/inicio.module').then( m => m.InicioPageModule),
    data: { title: 'Tarot y Rituales - María Fernández', description: 'Tarot y rituales gratis con María Fernández. Consulta tu horóscopo diario y tiradas personalizadas.' }
  },
  {
    path: 'menu',
    loadChildren: () => import('./pages/menu/menu.module').then( m => m.MenuPageModule),
    data: { title: 'Menú - Tarot y Rituales', description: 'Elige entre tarot diario, tarot sí o no, horóscopo, rituales gratuitos y trabajos personalizados.' }
  },
  {
    path: 'tarot-diario',
    loadChildren: () => import('./pages/tarot-diario/tarot-diario.module').then( m => m.TarotDiarioPageModule),
    data: { title: 'Tarot Diario - María Fernández', description: 'Elige un tema y descubre lo que las cartas del tarot tienen para ti hoy.' }
  },
  {
    path: 'tarot-preguntas',
    loadChildren: () => import('./pages/tarot-preguntas/tarot-preguntas.module').then( m => m.TarotPreguntasPageModule),
    data: { title: 'Tarot Sí o No - María Fernández', description: 'Haz una pregunta al tarot y obtén una respuesta de sí o no.' }
  },
  {
    path: 'tarot-horoscopo',
    loadChildren: () => import('./pages/tarot-horoscopo/tarot-horoscopo.module').then( m => m.TarotHoroscopoPageModule),
    data: { title: 'Tu Horóscopo del Día', description: 'Tu horóscopo del día con predicciones detalladas y signos compatibles.' }
  },
  {
    path: 'tarot-diario-detalle',
    loadChildren: () => import('./pages/tarot-diario-detalle/tarot-diario-detalle.module').then( m => m.TarotDiarioDetallePageModule),
    data: { title: 'Tu Tirada - Tarot Diario', description: 'Selecciona tres cartas para tu tirada de tarot personalizada.' }
  },
  {
    path: 'resultados',
    loadChildren: () => import('./pages/resultados/resultados.module').then( m => m.ResultadosPageModule),
    data: { title: 'Resultados de tu Tirada', description: 'Descubre la interpretación de tu tirada de tarot con inteligencia artificial.' }
  },
  {
    path: 'resultados-chatgpt',
    loadChildren: () => import('./pages/resultados-chatgpt/resultados-chatgpt.module').then( m => m.ResultadosChatgptPageModule),
    data: { title: 'Tu Respuesta - Tarot', description: 'Tu respuesta personalizada del tarot con inteligencia artificial.' }
  },
  {
    path: 'politicas',
    loadChildren: () => import('./pages/politicas/politicas.module').then( m => m.PoliticasPageModule),
    data: { title: 'Política de Privacidad', description: 'Política de privacidad de la aplicación Tarot y Rituales.' }
  },  {
    path: 'trabajos-personalizados',
    loadChildren: () => import('./pages/trabajos-personalizados/trabajos-personalizados.module').then( m => m.TrabajosPersonalizadosPageModule),
    data: { title: 'Trabajos Personalizados', description: 'Solicita trabajos personalizados de tarot y rituales con María Fernández.' }
  },
  {
    path: 'list-horoscopo',
    loadChildren: () => import('./pages/list-horoscopo/list-horoscopo.module').then( m => m.ListHoroscopoPageModule),
    data: { title: 'Horóscopo - María Fernández', description: 'Consulta el horóscopo diario de todos los signos del zodiaco.' }
  },
  {
    path: 'offline',
    loadChildren: () => import('./pages/offline/offline.module').then( m => m.OfflinePageModule),
    data: { title: 'Sin Conexión', description: 'Sin conexión a Internet.' }
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
