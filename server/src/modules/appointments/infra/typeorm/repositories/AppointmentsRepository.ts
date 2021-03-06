import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindByDateDTO from '@modules/appointments/dtos/IFindByDateDTO'
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import { getRepository, Raw, Repository } from 'typeorm'
import Appointment from '../entities/Appointment'

/**
 *
 * SOLID
 *
 * [ ] Single Responsability Principle
 * [ ] Open-Closed Principle
 * [x] Liskov Substitution Principle
 * [ ] Interface Segregation Principle
 * [ ] Dependency Inversion Principle
 *
 */

class AppointmentsRepository implements IAppointmentsRepository {
  private ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = getRepository(Appointment)
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user']
    });

    return appointments;
  }

  async create({
    provider_id,
    user_id,
    date
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date
    })
    await this.ormRepository.save(appointment)

    return appointment
  }
  async findByDate({
    provider_id,
    date
  }: IFindByDateDTO): Promise<Appointment | undefined> {
    const appointment = await this.ormRepository.findOne({
      where: {
        provider_id,
        date
      }
     })

    return appointment
  }
}
export default AppointmentsRepository
