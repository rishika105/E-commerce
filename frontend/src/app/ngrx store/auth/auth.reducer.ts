import { createReducer, on } from '@ngrx/store';
import { setLoading, setToken, clearToken, setOtpSent, setRole, logout } from '../../ngrx store/auth/auth.action';

export interface AuthState {
  token: string | null;
  loading: boolean;
  otpSent: boolean;
  role: string | null;  // Add role to state
}

// Helper function to check if we are in the browser
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

const initialState: AuthState = {
  token: isBrowser() && localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token')!) : null,
  loading: false,
  otpSent: false,
  role: isBrowser() && localStorage.getItem('role') ? JSON.parse(localStorage.getItem('role')!) : null,  // Initialize role from localStorage
};

export const authReducer = createReducer(
  initialState,

  // Set loading state
  on(setLoading, (state, { loading }) => ({
    ...state,
    loading,
  })),

  // Set token and role, and store them in localStorage
  on(setToken, (state, { token }) => {
    if (isBrowser()) {
      localStorage.setItem('token', JSON.stringify(token));
    }
    return {
      ...state,
      token, // Update token in state
    };
  }),

  on(setRole, (state, { role }) => {
    if (isBrowser()) {
      localStorage.setItem('role', JSON.stringify(role));  // Save role in localStorage
    }
    return {
      ...state,
      role  // Update role in state
    };
  }),

  // Clear token and role from state and localStorage (used for logout)
  on(clearToken, (state) => {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');  // Also remove role from localStorage
    }
    return {
      ...state,
      token: null,
      role: null  // Clear role in state
    };
  }),

  // Handle logout action by clearing the token, role, and resetting state
  on(logout, (state) => {
    if (isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }
    return {
      ...state,
      token: null,
      role: null, // Clear role in state
      loading: false, // Reset loading state
      otpSent: false, // Reset OTP state
    };
  }),

  // Set OTP sent status
  on(setOtpSent, (state, { otpSent }) => ({
    ...state,
    otpSent,
  }))
);
