import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesService } from './services/games.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('PLAYtop');
  private gamesService = inject(GamesService);

  ngOnInit(): void {
    // DÍA 2 — Primer fetch: mostrar en consola los 20 juegos más populares
    console.log('🎮 PLAYtop — Cargando los 20 juegos más populares desde RAWG API...');

    this.gamesService.getPopularGames().subscribe({
      next: (response) => {
        console.log(`✅ Se obtuvieron ${response.results.length} juegos de ${response.count} totales`);
        console.log('📋 Top 20 juegos más populares:');
        response.results.forEach((game, index) => {
          console.log(
            `${index + 1}. ${game.name} | ⭐ ${game.rating} | 📅 ${game.released ?? 'N/A'} | 🎮 ${game.genres?.map(g => g.name).join(', ') || 'Sin género'}`
          );
        });
        console.table(
          response.results.map(g => ({
            Nombre: g.name,
            Rating: g.rating,
            Lanzamiento: g.released,
            Géneros: g.genres?.map(genre => genre.name).join(', ')
          }))
        );
      },
      error: (err) => {
        console.error('❌ Error al cargar juegos:', err.message);
      }
    });
  }
}
