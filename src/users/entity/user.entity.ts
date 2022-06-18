import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar')
  @Exclude()
  password: string;
}
