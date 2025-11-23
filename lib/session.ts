// Simple session management utilities
export interface SessionUser {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
  about?: string;
}

export const setSession = (user: SessionUser) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('session_user', JSON.stringify(user));
  }
};

export const getSession = (): SessionUser | null => {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('session_user');
    return session ? JSON.parse(session) : null;
  }
  return null;
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session_user');
  }
};
