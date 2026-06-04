import { Routes } from '@angular/router';
import { HomeComponent }       from './features/home/home';
import { GameDetailComponent } from './features/game-details/game-detail';
import { FavoritesComponent }  from './features/favorites/favorites';
import { NotFoundComponent }   from './features/not-found/not-found';


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
