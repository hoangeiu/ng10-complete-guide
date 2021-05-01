import { Action } from '@ngrx/store';
import { Ingredient } from 'src/shared/ingredient.model';
import * as shoppingListTypes from './shopping-list.types';

export class AddIngredient implements Action {
  readonly type = shoppingListTypes.ADD_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = shoppingListTypes.ADD_INGREDIENTS;
  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = shoppingListTypes.UPDATE_INGREDIENT;
  constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
  readonly type = shoppingListTypes.DELETE_INGREDIENT;
}

export class StartEdit implements Action {
  readonly type = shoppingListTypes.START_EDIT;
  constructor(public payload: number) {}
}

export class StopEdit implements Action {
  readonly type = shoppingListTypes.STOP_EDIT;
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEdit
  | StopEdit;
