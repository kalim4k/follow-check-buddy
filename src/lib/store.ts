export interface UserProfile {
  id: number;
  username: string;
  name: string;
  photoUrl: string;
  verified: boolean;
  isSubscribed: boolean;
  hasLiked: boolean;
  hasCommented: boolean;
}

export interface ProfileStats {
  abonnements: string;
  abonnes: string;
  jaime: string;
}

const DEFAULT_USERS: UserProfile[] = [
  { id: 1, username: 'alex_dev', name: 'Alexandre', photoUrl: '', verified: false, isSubscribed: true, hasLiked: false, hasCommented: true },
  { id: 2, username: 'marie.design', name: 'Marie UX', photoUrl: '', verified: true, isSubscribed: true, hasLiked: true, hasCommented: false },
  { id: 3, username: 'lucas_99', name: 'Lucas', photoUrl: '', verified: false, isSubscribed: false, hasLiked: false, hasCommented: false },
  { id: 4, username: 'sophie_art', name: 'Sophie', photoUrl: '', verified: false, isSubscribed: true, hasLiked: true, hasCommented: true },
  { id: 5, username: 'thomas.code', name: 'Thomas', photoUrl: '', verified: true, isSubscribed: false, hasLiked: true, hasCommented: false },
];

const DEFAULT_STATS: ProfileStats = {
  abonnements: '26',
  abonnes: '10K',
  jaime: '32.5K',
};

const USERS_KEY = 'roomtok_users';
const STATS_KEY = 'roomtok_stats';

export function getUsers(): UserProfile[] {
  try {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: UserProfile[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getStats(): ProfileStats {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : DEFAULT_STATS;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: ProfileStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
