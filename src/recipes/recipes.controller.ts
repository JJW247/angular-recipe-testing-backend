import {
  Body,
  Controller,
  Get,
  ParseArrayPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/users/guard/jwt.guard';
import { RecipeTypeClass } from './model/recipe-type-class';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesServce: RecipesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getRecipes() {
    return this.recipesServce.getRecipes();
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  setRecipes(
    @Body(new ParseArrayPipe({ items: RecipeTypeClass }))
    requestBody: RecipeTypeClass[],
  ) {
    return this.recipesServce.setRecipes(requestBody);
  }
}
