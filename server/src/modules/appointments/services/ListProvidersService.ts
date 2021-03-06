import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe'

interface IRequest {
  user_id: string
}

@injectable()
export default class FindProvidersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider
  ) { }
  async execute({ user_id }: IRequest): Promise<User[]> {
    let providers = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`)

    if(!providers) {
      providers = await this.usersRepository.findAllProviders({
        except_user_id: user_id
      })
      await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(providers))
    }
    return providers
  }
}

