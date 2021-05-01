import { User } from '../user.model';
import * as authActions from './auth.actions';
import * as authTypes from './auth.types';

export interface authState {
  user: User;
}

const initialState: authState = {
  user: null,
};

export function authReducer(
  state = initialState,
  action: authActions.AuthActions
) {
  switch (action.type) {
    case authTypes.LOGIN:
      const { email, userId, token, expirationDate } = action.payload;
      const user = new User(email, userId, token, expirationDate);

      return {
        ...state,
        user,
      };

    case authTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };

    default:
      return state;
  }
}
