import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('users')
@Unique(['username']) // Ensures usernames are unique in the database
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
