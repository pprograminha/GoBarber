import AppError from "@shared/errors/AppError"
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider"
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository"
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository"
import ResetPasswordService from "./ResetPasswordService"

let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPassword: ResetPasswordService

describe('ResetPassword', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository()
    fakeUserTokensRepository = new FakeUserTokensRepository()
    fakeHashProvider = new FakeHashProvider()

    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    )
  })

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    })
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')
    const { token } = await fakeUserTokensRepository.generate(
      user.id
    )

    await resetPassword.execute({
      token,
      password: '123123'
    })
    expect(generateHash).toHaveBeenCalledWith('123123')
    expect(user.password).toBe('123123')
  })
  it('should not be able to reset the password with non-existent token', async () => {

    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)

  })
  it('should not be able to reset the password with non-existent user', async () => {
    const { token } = await fakeUserTokensRepository.generate('non-existing-user')

    await expect(
      resetPassword.execute({
        token,
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)

  })
  it('should not be able to reset the password after two hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const { token } = await fakeUserTokensRepository.generate(user.id)

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const currentDate = new Date()

      return currentDate.setHours(currentDate.getHours() + 3)
    })

    await expect(
      resetPassword.execute({
        token,
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)


  })
})
