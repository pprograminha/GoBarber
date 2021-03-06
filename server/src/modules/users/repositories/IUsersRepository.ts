import ICreateUserDTO from "../dtos/ICreateUserDTO";
import IFindAllProvidersDTO from "../dtos/IFindAllProvidersDTO";
import User from "../infra/typeorm/entities/User";

export default interface IUsersRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[]>
  findByEmail(email: string): Promise<User | undefined>
  findById(id: string | number): Promise<User | undefined>
  create(userData: ICreateUserDTO): Promise<User>
  save(user: User): Promise<User>

}
