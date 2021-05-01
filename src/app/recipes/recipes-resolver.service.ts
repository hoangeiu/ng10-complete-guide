import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { DataStorageService } from 'src/shared/data-storage.service';
import { AppState } from '../store/app.reducer';
import { Recipe } from './recipe.model';
import { RecipeService } from './recipe.service';
import * as recipesActions from '../recipes/store/recipe.actions';
import * as recipesTypes from '../recipes/store/recipe.types';
import { Actions, ofType } from '@ngrx/effects';
import { map, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select('recipes').pipe(
      take(1),
      map((recipesState) => recipesState.recipes),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new recipesActions.FetchRecipes());
          return this.actions$.pipe(ofType(recipesTypes.SET_RECIPES), take(1));
        } else {
          return of(recipes);
        }
      })
    );
  }
}
