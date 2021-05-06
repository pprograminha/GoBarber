import { container } from 'tsyringe'

import '@modules/users/providers'
import './providers'

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'


import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository'
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository'
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository'



container.registerSingleton<IUserTokensRepository>('UserTokensRepository', UserTokensRepository)
container.registerSingleton<IUsersRepository>('UsersRepository', UsersRepository)
container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository)
