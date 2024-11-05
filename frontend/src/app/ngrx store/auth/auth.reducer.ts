import { createReducer, on } from '@ngrx/store';
import { setLoading, setToken, setUserId, clearToken, setOtpSent, setRole, logout } from '../../ngrx store/auth/auth.action';

export interface AuthState {
  token: string | null;
  loading: boolean;
  otpSent: boolean;
  role: string | null;
  user_id: number | null;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

// Helper function to safely get item from localStorage
function getStorageItem(key: string): any {
  if (!isBrowser()) return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item);
  } catch {
    // If parsing fails, return the raw value
    return item;
  }
}

const initialState: AuthState = {
  token: getStorageItem('token'),
  loading: false,
  otpSent: false,
  role: getStorageItem('role'),
  user_id: getStorageItem('user_id')
};

export const authReducer = createReducer(
  initialState,

  on(setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),

  on(setToken, (state, { token }) => {
    if (isBrowser()) {
      // Store token without stringifying if it's already a string
      localStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token));
    }
    return { ...state, token };
  }),

  on(setUserId, (state, { userId }) => {
    if (isBrowser()) {
      localStorage.setItem('user_id', JSON.stringify(userId));
      console.log('Stored user_id:', userId); 
    }
    return { ...state, user_id: userId };
  }),

  on(setRole, (state, { role }) => {
    if (isBrowser()) {
      localStorage.setItem('role', typeof role === 'string' ? role : JSON.stringify(role));
    }
    return {
      ...state,
      role
    };
  }),

  on(clearToken, (state) => {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
    }
    return {
      ...state,
      token: null,
      role: null,
      user_id: null
    };
  }),

  on(logout, (state) => {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
    }
    return {
      ...state,
      token: null,
      role: null,
      user_id: null,
      loading: false,
      otpSent: false,
    };
  }),

  on(setOtpSent, (state, { otpSent }) => ({
    ...state,
    otpSent,
  }))
);
