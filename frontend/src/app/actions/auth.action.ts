import { createAction, props } from '@ngrx/store';

// Define actions for setting loading, setting token, clearing token, etc.
export const setLoading = createAction(
  '[Auth] Set Loading',
  props<{ loading: boolean }>()
);

export const setToken = createAction(
  '[Auth] Set Token',
  props<{ token: string | null }>()
);

export const clearToken = createAction('[Auth] Clear Token');

export const setOtpSent = createAction(
  '[Auth] Set OTP Sent',
  props<{ otpSent: boolean }>()
);
