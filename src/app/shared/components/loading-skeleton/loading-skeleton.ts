import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './loading-skeleton.html',
  styleUrl: './loading-skeleton.scss'
})
export class LoadingSkeletonComponent {
  @Input() count: number = 8;

  get skeletonCards(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
