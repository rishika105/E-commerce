import { createReducer, on } from '@ngrx/store';
import * as ProductActions from '../actions/product.action';
import { Product } from '../services/product.service';

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: any;
}

export const initialState: ProductState = {
  products: [],
  loading: false,
  error: null
};

export const productReducer = createReducer(
  initialState,
  on(ProductActions.loadProducts, state => ({ ...state, loading: true })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({ ...state, products, loading: false })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({ ...state, products: [...state.products, product] })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  on(ProductActions.updateStockSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map(p => p.id === product.id ? product : p)
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter(p => p.id !== id)
  })),
  on(ProductActions.searchProductsSuccess, (state, { products }) => ({ ...state, products }))
);
