import AppError from "@shared/errors/AppError";
import { inject, injectable } from "tsyringe";
import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";

interface IRequest {
  user_id: string
}

@injectable()
export default class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }

  async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id)

    if (!user) throw new AppError('User does not exists.', 401)

    return user
  }
}
