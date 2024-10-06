// auth.actions.ts
import { createAction, props } from '@ngrx/store';

// Signup actions
export const setLoading = createAction('[Auth] Set Loading', props<{ loading: boolean }>());
export const setToken = createAction('[Auth] Set Token', props<{ token: string | null }>());
export const clearToken = createAction('[Auth] Clear Token');
export const setOtpSent = createAction('[Auth] Set OTP Sent', props<{ otpSent: boolean }>());

// Register action
export const registerUser = createAction(
  '[Auth] Register User',
  props<{ name: string, email: string, password: string }>()
);

// Verify OTP action
export const verifyOtp = createAction(
  '[Auth] Verify OTP',
  props<{ email: string, otp: string }>()
);

// Login action
export const loginUser = createAction(
  '[Auth] Login User',
  props<{ email: string, password: string }>()
);
