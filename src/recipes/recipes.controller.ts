import { Body, Controller, Get, ParseArrayPipe, Put } from '@nestjs/common';
import { RecipeTypeClass } from './model/recipe-type-class';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesServce: RecipesService) {}

  @Get()
  getRecipes() {
    return this.recipesServce.getRecipes();
  }

  @Put()
  setRecipes(
    @Body(new ParseArrayPipe({ items: RecipeTypeClass }))
    requestBody: RecipeTypeClass[],
  ) {
    return this.recipesServce.setRecipes(requestBody);
  }
}
