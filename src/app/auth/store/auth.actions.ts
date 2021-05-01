import { Action } from '@ngrx/store';
import * as authTypes from './auth.types';

export class LoginStart implements Action {
  readonly type = authTypes.LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class Login implements Action {
  readonly type = authTypes.LOGIN;
  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
    }
  ) {}
}

export class Logout implements Action {
  readonly type = authTypes.LOGOUT;
}

export type AuthActions = Login | Logout;
