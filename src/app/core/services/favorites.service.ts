import { Injectable, signal } from '@angular/core';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'playtop_favorites';
  
  // Reactively track favorite games list
  favoriteGames = signal<Game[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Adds a game to the favorites list and persists it
   */
  addFavorite(game: Game): void {
    if (this.isFavorite(game.id)) return;
    
    // Update the signal value
    this.favoriteGames.update(current => {
      const updated = [...current, game];
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Removes a game from the favorites list by ID and persists it
   */
  removeFavorite(id: number): void {
    this.favoriteGames.update(current => {
      const updated = current.filter(game => game.id !== id);
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Checks if a game is in the favorites list
   */
  isFavorite(id: number): boolean {
    return this.favoriteGames().some(game => game.id === id);
  }

  /**
   * Loads the favorites from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as Game[];
        if (Array.isArray(parsed)) {
          this.favoriteGames.set(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
  }

  /**
   * Saves the favorites list to localStorage
   */
  private saveToStorage(games: Game[]): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  }
}
