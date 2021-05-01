import { Action } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as recipesTypes from './recipe.types';

export class SetRecipes implements Action {
  readonly type = recipesTypes.SET_RECIPES;
  constructor(public payload: Recipe[]) {}
}

export class FetchRecipes implements Action {
  readonly type = recipesTypes.FETCH_RECIPES;
}

export class AddRecipe implements Action {
  readonly type = recipesTypes.ADD_RECIPE;
  constructor(public payload: Recipe) {}
}

export class UpdateRecipe implements Action {
  readonly type = recipesTypes.UPDATE_RECIPE;
  constructor(public payload: { index: number; recipe: Recipe }) {}
}

export class DeleteRecipe implements Action {
  readonly type = recipesTypes.DELETE_RECIPE;
  constructor(public payload: number) {}
}

export class StoreRecipes implements Action {
  readonly type = recipesTypes.STORE_RECIPES;
}

export type RecipesActions =
  | SetRecipes
  | FetchRecipes
  | AddRecipe
  | UpdateRecipe
  | DeleteRecipe
  | StoreRecipes;
