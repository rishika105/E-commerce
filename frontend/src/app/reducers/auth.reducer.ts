import { createReducer, on } from '@ngrx/store';
import { setLoading, setToken, clearToken, setOtpSent } from '../actions/auth.action';  // Import your actions

export interface AuthState {
  token: string | null;
  loading: boolean;
  otpSent: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
  loading: false,
  otpSent: false,
};

// Use the imported actions in the reducer
export const authReducer = createReducer(
  initialState,
  on(setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),
  on(setToken, (state, { token }) => {
    localStorage.setItem('token', JSON.stringify(token));
    return {
      ...state,
      token,
    };
  }),
  on(clearToken, (state) => {
    localStorage.removeItem('token');
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
