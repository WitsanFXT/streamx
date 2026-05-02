// TMDb API configuration
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
export const IMG_BASE_ORIGINAL = 'https://image.tmdb.org/t/p/original';

const fetchTMDB = async (endpoint, params = {}) => {
  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', TMDB_API_KEY);
  url.searchParams.set('language', 'pt-BR');
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`TMDb error: ${res.status}`);
  return res.json();
};

export const tmdb = {
  image: (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : null,
  backdrop: (path) => path ? `https://image.tmdb.org/t/p/original${path}` : null,
  getTrending: () => fetchTMDB('/trending/all/week'),
  getPopularMovies: () => fetchTMDB('/movie/popular'),
  getTopRatedMovies: () => fetchTMDB('/movie/top_rated'),
  getPopularSeries: () => fetchTMDB('/tv/popular'),
  getTopRatedSeries: () => fetchTMDB('/tv/top_rated'),
  getMovie: (id) => fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,videos,similar' }),
  getSeries: (id) => fetchTMDB(`/tv/${id}`, { append_to_response: 'credits,videos,similar,seasons' }),
  getSeriesSeason: (id, season) => fetchTMDB(`/tv/${id}/season/${season}`),
  search: (query) => fetchTMDB('/search/multi', { query }),
  getGenres: (type = 'movie') => fetchTMDB(`/genre/${type}/list`),
  getByGenre: (genreId, type = 'movie') => fetchTMDB(`/discover/${type}`, { with_genres: genreId, sort_by: 'popularity.desc' }),
};