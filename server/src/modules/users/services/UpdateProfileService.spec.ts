import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider"
import AppError from "@shared/errors/AppError"
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider"
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository"
import UpdateProfileService from "./UpdateProfileService"

let fakeHashProvider: FakeHashProvider
let fakeUsersRepository: FakeUsersRepository
let fakeCacheProvider: FakeCacheProvider
let updateProfile: UpdateProfileService

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider()
    fakeUsersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()
    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider
    )
  })

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John',
      email: 'john@example.com'
    })

    expect(updatedUser.name).toBe('John')
    expect(updatedUser.email).toBe('john@example.com')
  })

  it('should not be able to update the profile if the user does not exists', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user',
        name: 'John Doe',
        email: 'johndoe@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'John',
      email: 'john@example.com',
      password: '123456'
    })
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john@example.com',
      })
    ).rejects.toBeInstanceOf(AppError)
  })
  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      old_password: '123456',
      password: '123123'
    })

    expect(updatedUser.password).toBe('123123')
  })
  it('should not be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })

  it('should not be able to update the password with the wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    })


    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'johndoe@example.com',
        old_password: 'wrong-old-password',
        password: '123123'
      })
    ).rejects.toBeInstanceOf(AppError)
  })


})
