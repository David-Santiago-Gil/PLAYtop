import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Game, GamesResponse } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GamesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  /**
   * Obtiene los 20 juegos más populares (ordenados por -rating)
   */
  getPopularGames(): Observable<GamesResponse> {
    return this.http
      .get<GamesResponse>(`${this.baseUrl}/games`, {
        params: {
          ordering: '-rating',
          page_size: '22' // Fetch a couple extra to account for filters
        }
      })
      .pipe(
        map((response: GamesResponse) => {
          response.results = response.results.filter(
            game => 
              game && 
              game.name && 
              !game.name.toLowerCase().includes('hazbin hotel') && 
              !game.name.toLowerCase().includes('charlie')
          ).slice(0, 20);
          return response;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Busca juegos por nombre
   */
  searchGames(query: string): Observable<GamesResponse> {
    return this.http
      .get<GamesResponse>(`${this.baseUrl}/games`, {
        params: {
          search: query,
          page_size: '20'
        }
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtiene el detalle completo de un juego por su ID
   */
  getGameById(id: number): Observable<Game> {
    return this.http
      .get<Game>(`${this.baseUrl}/games/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo centralizado de errores HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error al cargar los juegos. Intenta de nuevo.';

    if (error.status === 0) {
      errorMessage = 'Conexión fallida. ¿Problema con la red?';
    } else if (error.status === 401) {
      errorMessage = 'API Key inválida. Verifica tu configuración.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado.';
    } else if (error.status >= 500) {
      errorMessage = 'Error del servidor de RAWG. Intenta más tarde.';
    }

    console.error('GamesService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
