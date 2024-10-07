import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../reducers/auth.reducer';

export interface AppState {
  auth: AuthState;
}

export const rootReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
};
