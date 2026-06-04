import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GamesService } from '../../core/services/games.service';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export class GameDetailComponent implements OnInit {
  private route   = inject(ActivatedRoute);
  private service = inject(GamesService);

  game    = signal<Game | null>(null);
  loading = signal(true);
  error   = signal<string | null>(null);

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
  }

  getMetacriticClass(score: number | null): string {
    if (!score) return '';
    if (score >= 75) return 'meta--green';
    if (score >= 50) return 'meta--yellow';
    return 'meta--red';
  }

  getRatingStars(rating: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  getShortDescription(text: string | undefined, maxLen = 400): string {
    if (!text) return '';
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '…';
  }
}
