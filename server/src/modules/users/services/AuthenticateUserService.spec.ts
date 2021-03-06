import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"
import AppError from "@shared/errors/AppError"
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider"
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository"
import AuthenticateUserService from "./AuthenticateUserService"
import CreateUserService from "./CreateUserService"

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let fakeCacheProvider: FakeCacheProvider

let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeHashProvider = new FakeHashProvider()
    fakeCacheProvider = new FakeCacheProvider()
    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider, fakeCacheProvider)
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider)
  })

  it('should be able to authenticate a user', async () => {

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(response).toHaveProperty('token')
    expect(response.user).toEqual(user)
  })
  it('should not be able to authenticate with non-existent user', async () => {

    await expect(authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(AppError)

  })
  it('should not be able to authenticate with an invalid user password', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    })

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError)

  })
})
