import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Recipe } from 'src/app/recipes/recipe.model';
import { RecipeService } from 'src/app/recipes/recipe.service';
import { exhaustMap, map, take, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://ng10-complete-guide-9ac2d-default-rtdb.firebaseio.com/recipes.json',
        recipes
      )
      .subscribe((response) => console.log(response));
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng10-complete-guide-9ac2d-default-rtdb.firebaseio.com/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((recipes) => this.recipeService.setRecipes(recipes))
      );
    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this.http.get<Recipe[]>(
    //       'https://ng10-complete-guide-9ac2d-default-rtdb.firebaseio.com/recipes.json',
    //       {
    //         params: new HttpParams().set('auth', user.token),
    //       }
    //     );
    //   }),
    //   map((recipes) => {
    //     return recipes.map((recipe) => {
    //       return {
    //         ...recipe,
    //         ingredients: recipe.ingredients ? recipe.ingredients : [],
    //       };
    //     });
    //   }),
    //   tap((recipes) => this.recipeService.setRecipes(recipes))
    // );
  }
}
