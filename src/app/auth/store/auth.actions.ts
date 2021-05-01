import { Action } from '@ngrx/store';
import * as authTypes from './auth.types';

export class LoginStart implements Action {
  readonly type = authTypes.LOGIN_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateSuccess implements Action {
  readonly type = authTypes.AUTHENTICATE_SUCCESS;
  constructor(
    public payload: {
      email: string;
      userId: string;
      token: string;
      expirationDate: Date;
      redirect: boolean;
    }
  ) {}
}

export class AuthenticateFailure implements Action {
  readonly type = authTypes.AUTHENTICATE_FAILURE;
  constructor(public payload: string) {}
}

export class SignupStart implements Action {
  readonly type = authTypes.SINGUP_START;
  constructor(public payload: { email: string; password: string }) {}
}

export class AutoLogin implements Action {
  readonly type = authTypes.AUTO_LOGIN;
}

export class Logout implements Action {
  readonly type = authTypes.LOGOUT;
}

export class ClearError implements Action {
  readonly type = authTypes.CLEAR_ERROR;
}

export type AuthActions =
  | LoginStart
  | AuthenticateSuccess
  | AuthenticateFailure
  | SignupStart
  | AutoLogin
  | Logout
  | ClearError;
