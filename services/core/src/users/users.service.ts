import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // This is a helper function to hash the password
  async hashPassword(password: string, saltOrRounds: string): Promise<string> {
    return bcrypt.hash(password, saltOrRounds);
  }

  // Example method to create a user
  async create(username: string, password: string): Promise<User> {
    const user = new User();
    user.username = username;
    user.password = await this.hashPassword(
      password,
      process.env.BCRYPT_ROUNDS,
    );

    return this.usersRepository.save(user);
  }

  async validateUser(username: string, password: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      return true;
    }
    return false;
  }
}
