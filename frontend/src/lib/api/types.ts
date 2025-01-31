export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface Superhero {
  id: number;
  name: string;
  superpower: string;
  humilityScore: number;
  createdAt: string;
}
