export interface Platform {
  platform: {
    id: number;
    name: string;
    slug: string;
  };
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
}

export interface Game {
  id: number;
  name: string;
  slug: string;
  background_image: string;
  rating: number;
  rating_top: number;
  released: string;
  genres: Genre[];
  platforms: Platform[];
  metacritic: number | null;
  playtime: number;
  tags: { id: number; name: string; slug: string }[];
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}
