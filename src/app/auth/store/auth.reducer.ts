import { User } from '../user.model';
import * as authActions from './auth.actions';
import * as authTypes from './auth.types';

export interface authState {
  user: User;
  authError: string;
  isLoading: boolean;
}

const initialState: authState = {
  user: null,
  authError: null,
  isLoading: false,
};

export function authReducer(
  state = initialState,
  action: authActions.AuthActions
) {
  switch (action.type) {
    case authTypes.LOGIN_START:
    case authTypes.SINGUP_START:
      return {
        ...state,
        authError: null,
        isLoading: true,
      };

    case authTypes.AUTHENTICATE_SUCCESS:
      const { email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);

      return {
        ...state,
        user,
        authError: null,
        isLoading: false,
      };

    case authTypes.AUTHENTICATE_FAILURE:
      return {
        ...state,
        user: null,
        authError: action.payload,
        isLoading: false,
      };

    case authTypes.LOGOUT:
      return {
        ...state,
        user: null,
        authError: null,
        isLoading: false,
      };

    case authTypes.CLEAR_ERROR:
      return {
        ...state,
        authError: null,
      };

    default:
      return state;
  }
}
