import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../core/services/favorites.service';
import { GameCardComponent } from '../../shared/components/game-card/game-card';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [GameCardComponent, RouterLink],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);

  favoriteGames = this.favoritesService.favoriteGames;
}
