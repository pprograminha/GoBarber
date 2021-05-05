import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'
import { sign } from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'
import User from '../infra/typeorm/entities/User'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import IUsersRepository from '../repositories/IUsersRepository'


interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

/**
 *
 * SOLID
 *
 * [x] Single Responsability Principle
 * [ ] Open-Closed Principle
 * [x] Liskov Substitution Principle
 * [ ] Interface Segregation Principle
 * [x] Dependency Inversion Principle
 *
 */
@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) { }

  /**
   * execute
   */
  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new AppError('Incorrect email/password combination.', 401)

    const passwordMatched = await this.hashProvider.compareHash(password, user.password)

    if (!passwordMatched) throw new AppError('Incorrect email/password combination.', 401)

    const { expiresIn, secret } = authConfig.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token,
    }
  }
}
export default AuthenticateUserService
