import { Routes } from '@angular/router';
import { HomeComponent }       from './components/home/home';
import { GameDetailComponent } from './components/game-detail/game-detail';
import { FavoritesComponent }  from './components/favorites/favorites';
import { NotFoundComponent }   from './components/not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: 'PLAYtop — Top Juegos'
  },
  {
    path: 'search',
    component: HomeComponent,
    title: 'PLAYtop — Buscar Juegos'
  },
  {
    path: 'favorites',
    component: FavoritesComponent,
    title: 'PLAYtop — Mis Favoritos'
  },
  {
    path: 'details/:id',
    component: GameDetailComponent,
    title: 'PLAYtop — Detalle del Juego'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'PLAYtop — ¡GAME OVER!'
  }
];
