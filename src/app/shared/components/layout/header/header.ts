import { Component, signal, HostListener, inject, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GamesService } from '../../../../core/services/games.service';
import { Game } from '../../../../core/models/game.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  private gamesService = inject(GamesService);

  menuOpen = signal(false);
  scrolled = signal(false);

  // Autocomplete signals
  suggestions = signal<Game[]>([]);
  showSuggestions = signal(false);
  searchLoading = signal(false);
  activeIndex = signal(-1);

  // Debounce subject for search
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      takeUntilDestroyed(),
      debounceTime(300),
      distinctUntilChanged(),
      filter(query => query.length >= 3),
      switchMap(query => {
        this.searchLoading.set(true);
        return this.gamesService.searchSuggestions(query);
      })
    ).subscribe(results => {
      this.suggestions.set(results);
      this.showSuggestions.set(results.length > 0);
      this.searchLoading.set(false);
      this.activeIndex.set(-1);
    });
  }

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onSearchInput(value: string): void {
    if (value.trim().length < 3) {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
      this.searchLoading.set(false);
      return;
    }
    this.searchSubject.next(value.trim());
  }

  onSearch(event: Event, inputVal: string): void {
    event.preventDefault();
    const list = this.suggestions();
    if (list.length > 0) {
      const targetGame = this.activeIndex() >= 0 ? list[this.activeIndex()] : list[0];
      this.selectSuggestion(targetGame);
    }
  }

  selectSuggestion(game: Game): void {
    this.router.navigate(['/details', game.id]);
    this.closeSuggestions();
    this.closeMenu();
  }

  onKeydown(event: KeyboardEvent): void {
    const list = this.suggestions();
    if (!this.showSuggestions() || list.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex.update(i => (i + 1) % list.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex.update(i => (i - 1 + list.length) % list.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const targetGame = this.activeIndex() >= 0 ? list[this.activeIndex()] : list[0];
      this.selectSuggestion(targetGame);
    } else if (event.key === 'Escape') {
      this.closeSuggestions();
    }
  }

  closeSuggestions(): void {
    // Delay to allow click events on suggestions to fire first
    setTimeout(() => {
      this.showSuggestions.set(false);
      this.activeIndex.set(-1);
    }, 200);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }
}
