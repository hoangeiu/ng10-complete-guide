import { Recipe } from '../recipe.model';
import * as recipesTypes from './recipe.types';
import * as recipesActions from './recipe.actions';

export interface recipeState {
  recipes: Recipe[];
}

const initialState: recipeState = {
  recipes: [],
};

export function recipeReduce(
  state = initialState,
  action: recipesActions.RecipesActions
) {
  switch (action.type) {
    case recipesTypes.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };

    case recipesTypes.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };

    case recipesTypes.UPDATE_RECIPE: {
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe,
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;

      return { ...state, recipes: updatedRecipes };
    }

    case recipesTypes.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter(
          (recipe, index) => index !== action.payload
        ),
      };

    default:
      return state;
  }
}
