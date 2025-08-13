
import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from '../ngrx store/auth/auth.reducer';


export interface AppState {
  auth: AuthState;
  // wishlist : WishlistState

}

export const rootReducer: ActionReducerMap<AppState> = {
  auth: authReducer,
  // wishlist: wishlistReducer
};
