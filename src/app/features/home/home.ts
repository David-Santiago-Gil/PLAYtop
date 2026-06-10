import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GamesService } from '../../core/services/games.service';
import { Game } from '../../core/models/game.model';
import { GameCardComponent } from '../../shared/components/game-card/game-card';
import { LoadingSkeletonComponent } from '../../shared/components/loading-skeleton/loading-skeleton';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GameCardComponent, LoadingSkeletonComponent, RouterLink, DecimalPipe, DatePipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private gamesService = inject(GamesService);

  // ── Signals (estado reactivo) ──────────────────────────
  games = signal<Game[]>([]);
  featuredGame = signal<Game | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  searchQuery = signal<string | null>(null);

  // ── Computed signals (derivados) ───────────────────────
  resultCount = computed(() => this.games().length);
  hasResults  = computed(() => this.games().length > 0);
  isEmpty     = computed(() => !this.loading() && !this.error() && this.games().length === 0);
  isSearching = computed(() => !!this.searchQuery());

  constructor() {
    // Listen to query parameters to reload games when a search is triggered
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe(params => {
      const query = params['q'];
      this.searchQuery.set(query || null);
      this.loadGames(query);
    });
  }

  ngOnInit(): void { }

  private loadGames(query?: string): void {
    this.loading.set(true);
    this.error.set(null);
    if (!query) {
      this.featuredGame.set(null);
    }

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

        // Select a random game for the hero banner if not searching
        if (!query && response.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.results.length);
          this.featuredGame.set(response.results[randomIndex]);
        }

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
