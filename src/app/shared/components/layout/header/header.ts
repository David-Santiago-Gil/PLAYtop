import { Component, signal, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  private router = inject(Router);
  menuOpen = signal(false);
  scrolled = signal(false);

  toggleMenu(): void {
    this.menuOpen.update(v => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  onSearch(event: Event, inputVal: string): void {
    event.preventDefault();
    if (inputVal.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: inputVal.trim() } });
      this.closeMenu();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 20);
  }
}
