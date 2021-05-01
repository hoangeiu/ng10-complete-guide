import { Ingredient } from 'src/shared/ingredient.model';
import * as shoppingListTypes from './shopping-list.types';
import * as shoppingListActions from './shopping-list.actions';

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: ShoppingListState = {
  ingredients: [new Ingredient('Oragne', 10), new Ingredient('Lemon', 3)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export function shoppingListReducer(
  state: ShoppingListState = initialState,
  action: shoppingListActions.ShoppingListActions
) {
  switch (action.type) {
    case shoppingListTypes.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case shoppingListTypes.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case shoppingListTypes.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case shoppingListTypes.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (i, index) => index != state.editedIngredientIndex
        ),
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    case shoppingListTypes.START_EDIT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload,
      };

    case shoppingListTypes.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
}
