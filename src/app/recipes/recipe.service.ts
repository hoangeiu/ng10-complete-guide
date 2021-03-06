import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { Ingredient } from 'src/shared/ingredient.model';
import { Recipe } from './recipe.model';
import * as shoppingListActions from '../shopping-list/store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'Easy pancakes',
  //     'Learn a skill for life with our foolproof crêpe recipe that ensures perfect pancakes every time – elaborate flip optional',
  //     'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1273477_8-ad36e3b.jpg?webp=true&quality=90&resize=440%2C400',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Easy classic lasagne',
  //     'What else you need to say?',
  //     'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/classic-lasange-4a66137.jpg?webp=true&quality=90&resize=440%2C400',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   ),
  // ];
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new shoppingListActions.AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
