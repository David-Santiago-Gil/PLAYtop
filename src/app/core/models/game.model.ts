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
  background_image_additional?: string;
  rating: number;
  rating_top: number;
  ratings_count?: number;
  released: string;
  genres: Genre[];
  platforms: Platform[];
  metacritic: number | null;
  playtime: number;
  description_raw?: string;
  website?: string;
  tags: { id: number; name: string; slug: string }[];
  developers?: { id: number; name: string }[];
  publishers?: { id: number; name: string }[];
  esrb_rating?: { id: number; name: string; slug: string } | null;
}

export interface GamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Game[];
}
