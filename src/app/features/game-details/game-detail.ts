import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../core/services/games.service';
import { Game } from '../../core/models/game.model';
import { FavoritesService } from '../../core/services/favorites.service';
import { FormsModule } from '@angular/forms';
import { ReviewsService, Review } from '../../core/services/reviews.service';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export class GameDetailComponent implements OnInit {
  private route   = inject(ActivatedRoute);
  private service = inject(GamesService);
  private favoritesService = inject(FavoritesService);
  reviewsService = inject(ReviewsService);

  game    = signal<Game | null>(null);
  loading = signal(true);
  error   = signal<string | null>(null);
  
  // Reddit & User Reviews signals
  redditReviews = signal<any[]>([]);
  newUserName = signal('');
  newRating = signal(5);
  newComment = signal('');

  // Computed signals
  localReviews = computed(() => {
    const g = this.game();
    return g ? this.reviewsService.getReviews(g.id) : [];
  });

  // Computed: total de ratings
  totalRatings = computed(() => {
    const g = this.game();
    if (!g?.ratings) return 0;
    return g.ratings.reduce((sum, r) => sum + r.count, 0);
  });

  // Computed: barra de ratings ordenada de mayor a menor
  sortedRatings = computed(() => {
    const g = this.game();
    if (!g?.ratings) return [];
    return [...g.ratings].sort((a, b) => b.count - a.count);
  });

  isFavorite(): boolean {
    const game = this.game();
    return game ? this.favoritesService.isFavorite(game.id) : false;
  }

  toggleFavorite(): void {
    const game = this.game();
    if (!game) return;
    if (this.isFavorite()) {
      this.favoritesService.removeFavorite(game.id);
    } else {
      this.favoritesService.addFavorite(game);
    }
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error.set('ID de juego inválido.');
      this.loading.set(false);
      return;
    }

    this.service.getGameById(id).subscribe({
      next: (data) => {
        this.game.set(data);
        this.loading.set(false);
        console.log(`🎮 PLAYtop — Detalle de: ${data.name}`, data);
      },
      error: (err) => {
        this.error.set(err.message || 'Error al cargar el juego.');
        this.loading.set(false);
      }
    });

    this.service.getGameRedditPosts(id).subscribe(posts => {
      this.redditReviews.set(posts);
    });
  }

  submitReview(): void {
    const game = this.game();
    if (!game) return;
    const name = this.newUserName().trim() || 'Jugador Anónimo';
    const comment = this.newComment().trim();
    if (!comment) return;

    const review: Review = {
      userName: name,
      rating: this.newRating(),
      comment: comment,
      date: new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    };

    this.reviewsService.addReview(game.id, review);
    this.newUserName.set('');
    this.newComment.set('');
    this.newRating.set(5);
  }

  getMetacriticClass(score: number | null): string {
    if (!score) return '';
    if (score >= 75) return 'meta--green';
    if (score >= 50) return 'meta--yellow';
    return 'meta--red';
  }

  getRatingLabel(title: string): string {
    const labels: Record<string, string> = {
      'exceptional': '🏆 Excepcional',
      'recommended': '👍 Recomendado',
      'meh': '😐 Regular',
      'skip': '👎 Evitar'
    };
    return labels[title] || title;
  }

  getRatingColor(title: string): string {
    const colors: Record<string, string> = {
      'exceptional': '#00ff88',
      'recommended': '#4dabf7',
      'meh': '#ffd43b',
      'skip': '#ff6b6b'
    };
    return colors[title] || '#888';
  }

  getShortDescription(text: string | undefined, maxLen = 400): string {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '…';
  }
}
