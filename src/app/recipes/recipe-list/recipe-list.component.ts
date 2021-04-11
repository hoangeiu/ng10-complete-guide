import { Component, OnInit } from '@angular/core';
import { Recipe } from './recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe(
      'Easy pancakes',
      'Learn a skill for life with our foolproof crêpe recipe that ensures perfect pancakes every time – elaborate flip optional',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1273477_8-ad36e3b.jpg?webp=true&quality=90&resize=440%2C400'
    ),
    new Recipe(
      'Easy classic lasagne',
      'Kids will love to help assemble this easiest ever pasta bake with streaky bacon, beef mince, a crème fraîche sauce and gooey mozzarella',
      'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/classic-lasange-4a66137.jpg?webp=true&quality=90&resize=440%2C400'
    ),
  ];

  constructor() {}

  ngOnInit(): void {}
}
