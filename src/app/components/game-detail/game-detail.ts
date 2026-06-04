import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './game-detail.html',
  styleUrl: './game-detail.scss'
})
export class GameDetailComponent {
  private route = inject(ActivatedRoute);
  gameId = this.route.snapshot.paramMap.get('id');
}
