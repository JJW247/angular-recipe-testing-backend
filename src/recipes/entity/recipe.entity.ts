import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientInterface } from '../model/ingredient-interface';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column('varchar', { unique: true })
  name: string;

  @Column('varchar')
  description: string;

  @Column('varchar')
  imagePath: string;

  @Column('jsonb', { nullable: true })
  ingredients: IngredientInterface[];
}
