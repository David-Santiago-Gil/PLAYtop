import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DecimalPipe, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { take } from 'rxjs/operators';
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
  games = signal<Game[]>([]); // Used only for Search results
  popularGames = signal<Game[]>([]);
  topRatedGames = signal<Game[]>([]);
  infiniteGames = signal<Game[]>([]);
  
  featuredGame = signal<Game | null>(null);
  loading = signal(true);
  loadingInfinite = signal(false);
  error = signal<string | null>(null);
  searchQuery = signal<string | null>(null);

  currentPage = signal(1);
  hasMorePages = signal(true);

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

    if (query) {
      console.log(`🔍 PLAYtop — Buscando juegos con la consulta: "${query}"...`);
      this.gamesService.searchGames(query).subscribe({
        next: (response) => {
          this.games.set(response.results);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Error al buscar juegos');
          this.loading.set(false);
        }
      });
    } else {
      console.log('🎮 PLAYtop — Cargando secciones de inicio (Populares, Valorados y Listado Infinito)...');
      
      // Load Popular, Top Rated, and first page of Infinite catalog in parallel
      forkJoin({
        popular: this.gamesService.getPopularGames(),
        topRated: this.gamesService.getTopRatedGames(),
        allGames: this.gamesService.getAllGames(1, 20)
      }).subscribe({
        next: (res) => {
          this.popularGames.set(res.popular.results);
          this.topRatedGames.set(res.topRated.results);
          this.infiniteGames.set(res.allGames.results);
          this.currentPage.set(1);
          this.hasMorePages.set(res.allGames.results.length >= 20);

          // Select random game from popular list for featured banner
          if (res.popular.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * res.popular.results.length);
            this.featuredGame.set(res.popular.results[randomIndex]);
          }

          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err.message || 'Error al cargar los juegos');
          this.loading.set(false);
        }
      });
    }
  }

  loadNextPage(): void {
    if (this.loadingInfinite() || !this.hasMorePages() || this.isSearching()) {
      return;
    }

    this.loadingInfinite.set(true);
    const nextPage = this.currentPage() + 1;

    this.gamesService.getAllGames(nextPage, 20).subscribe({
      next: (response) => {
        if (response.results.length > 0) {
          this.infiniteGames.update(current => [...current, ...response.results]);
          this.currentPage.set(nextPage);
          this.hasMorePages.set(response.results.length >= 20);
        } else {
          this.hasMorePages.set(false);
        }
        this.loadingInfinite.set(false);
      },
      error: (err) => {
        console.error('Error loading next page for infinite scroll:', err);
        this.loadingInfinite.set(false);
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (this.isSearching() || this.loading() || this.error()) return;

    // Trigger load when page is scrolled close to the bottom (within 200px)
    const threshold = 200;
    const position = window.scrollY + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position >= height - threshold) {
      this.loadNextPage();
    }
  }
}
