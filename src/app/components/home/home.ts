import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GamesService } from '../../services/games.service';
import { Game } from '../../models/game.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gamesService = inject(GamesService);

  games = signal<Game[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal<string | null>(null);

  constructor() {
    // Listen to query parameters to reload games when a search is triggered
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      const query = params['q'];
      this.searchQuery.set(query || null);
      this.loadGames(query);
    });
  }

  ngOnInit(): void {}

  private loadGames(query?: string): void {
    this.loading.set(true);
    this.error.set(null);

    const games$ = query 
      ? this.gamesService.searchGames(query)
      : this.gamesService.getPopularGames();

    if (query) {
      console.log(`🔍 PLAYtop — Buscando juegos con la consulta: "${query}"...`);
    } else {
      console.log('🎮 PLAYtop — Cargando los 20 juegos más populares desde RAWG API...');
    }

    games$.subscribe({
      next: (response) => {
        this.games.set(response.results);
        this.loading.set(false);

        console.log(`✅ Se obtuvieron ${response.results.length} juegos de ${response.count} totales`);
        console.log(query ? `📋 Resultados de búsqueda para "${query}":` : '📋 Top 20 juegos más populares:');
        
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
        this.error.set(err.message || 'Error al cargar juegos');
        this.loading.set(false);
        console.error('❌ Error al cargar juegos:', err.message);
      }
    });
  }
}
