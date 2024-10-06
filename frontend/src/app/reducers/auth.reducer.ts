import { createReducer, on } from '@ngrx/store';
import { setLoading, setToken, clearToken, setOtpSent } from '../actions/auth.action';

export interface AuthState {
  token: string | null;
  loading: boolean;
  otpSent: boolean;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

const initialState: AuthState = {
  token: isBrowser() && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
  loading: false,
  otpSent: false,
};

export const authReducer = createReducer(
  initialState,
  on(setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
  on(setToken, (state, { token }) => {
    if (isBrowser()) {
      localStorage.setItem('token', JSON.stringify(token));
    }
    return {
      ...state,
      token,
    };
  }),
  on(clearToken, (state) => {
    if (isBrowser()) {
      localStorage.removeItem('token');
    }
    return {
      ...state,
      token: null,
    };
  }),
  on(setOtpSent, (state, { otpSent }) => ({
    ...state,
    otpSent,
  }))
);
