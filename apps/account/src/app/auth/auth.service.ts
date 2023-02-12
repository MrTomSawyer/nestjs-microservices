import { UserRole } from '@account/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities/user.entity';
import { UserRepository } from '../user/repositories/user.repository';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register({ email, password, displayName }: RegisterDto) {
    const oldUser = await this.userRepository.findUser(email);
    if (oldUser) {
      throw new Error('Such user has already registered');
    }
    const newUserEntity = await new UserEntity({
      displayName,
      email,
      passwordHash: '',
      role: UserRole.Student
    }).setPassword(password);

    const newUser = await this.userRepository.createUser(newUserEntity);
    return { email: newUser.email }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findUser(email);
    if (!user) {
      throw new Error('Wrong credentials');
    }
    const userEntity = new UserEntity(user);
    const isCorrectPassword = await userEntity.validatePasssword(password);
    if (!isCorrectPassword) {
      throw new Error('Wrong credentials');
    }
    return { id: user._id }
  }

  async login(id: string) {
    return {
      access_token: await this.jwtService.signAsync({ id })
    }
  }
}
