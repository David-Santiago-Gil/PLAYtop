import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Game } from '../../../core/models/game.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './game-card.html',
  styleUrl: './game-card.scss'
})
export class GameCardComponent {
  @Input({ required: true }) game!: Game;

  getMetacriticColor(score: number | null): string {
    if (!score) return 'meta-none';
    if (score >= 75) return 'meta-high';
    if (score >= 50) return 'meta-mid';
    return 'meta-low';
  }

  getPlatformIcon(slug: string): string {
    switch (slug) {
      case 'pc':
        return 'PC';
      case 'playstation':
      case 'playstation3':
      case 'playstation4':
      case 'playstation5':
        return 'PS';
      case 'xbox':
      case 'xbox360':
      case 'xbox-one':
      case 'xbox-series-x':
        return 'XB';
      case 'nintendo':
      case 'nintendo-switch':
        return 'NS';
      case 'ios':
      case 'android':
        return 'MOB';
      default:
        return 'SYS';
    }
  }

  // Helper to extract top platforms to avoid showing too many
  getUniquePlatforms(): string[] {
    if (!this.game.platforms) return [];
    const slugs = this.game.platforms.map(p => {
      const parent = p.platform.slug;
      if (parent.includes('playstation')) return 'playstation';
      if (parent.includes('xbox')) return 'xbox';
      if (parent.includes('nintendo') || parent === 'switch') return 'nintendo';
      if (parent === 'pc') return 'pc';
      if (parent === 'ios' || parent === 'android') return 'ios';
      return parent;
    });
    return Array.from(new Set(slugs)).slice(0, 4);
  }
}
