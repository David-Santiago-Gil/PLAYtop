import { Injectable, signal } from '@angular/core';

export interface Review {
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private readonly STORAGE_KEY = 'playtop_reviews';

  // Store reviews as a record of gameId -> Review[]
  reviewsMap = signal<Record<number, Review[]>>({});

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Retrieves the list of reviews for a specific game ID
   */
  getReviews(gameId: number): Review[] {
    return this.reviewsMap()[gameId] || [];
  }

  /**
   * Adds a review to a game and persists it
   */
  addReview(gameId: number, review: Review): void {
    this.reviewsMap.update(current => {
      const gameReviews = current[gameId] ? [...current[gameId], review] : [review];
      const updated = {
        ...current,
        [gameId]: gameReviews
      };
      this.saveToStorage(updated);
      return updated;
    });
  }

  /**
   * Loads reviews from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data) as Record<number, Review[]>;
        if (parsed && typeof parsed === 'object') {
          this.reviewsMap.set(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load reviews from localStorage:', error);
    }
  }

  /**
   * Saves reviews to localStorage
   */
  private saveToStorage(data: Record<number, Review[]>): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save reviews to localStorage:', error);
    }
  }
}
