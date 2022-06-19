import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './entity/recipe.entity';
import { RecipeTypeClass } from './model/recipe-type-class';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
    private readonly jwtService: JwtService,
  ) {}

  async getRecipes() {
    return await this.recipesRepository.find();
  }

  async setRecipes(requestBody: RecipeTypeClass[]) {
    await this.recipesRepository.clear();
    for (const recipe of requestBody) {
      await this.recipesRepository.save(recipe);
    }
    return await this.recipesRepository.find();
  }
}
