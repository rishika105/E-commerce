import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../ngrx store/auth/auth.reducer';


export interface AppState {
  auth: AuthState;

}

export const rootReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
};
