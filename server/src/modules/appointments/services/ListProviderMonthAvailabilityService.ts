import { getDate, getDaysInMonth, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
interface IRequest {
  provider_id: string,
  month: number,
  year: number
}
type IResponse = Array<{
  day: number,
  available: boolean
}>
@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository
  ) { }
  async execute({ provider_id, month, year }: IRequest): Promise<IResponse> {
    const appointmentsInMonth = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      month,
      year
    })


    const dayStart = 1
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth
      },
      (_, key) => key + dayStart
    )

    const compareCurrentDate = Date.now()

    const availability = eachDayArray.map(day => {
      const compareDateSendByUser = new Date(year, month - 1, day, 23, 59, 59)

      const appointmentsInDay = appointmentsInMonth.filter(appointment => {
        return getDate(appointment.date) === day
      })
      return (
        {
          day,
          available: (appointmentsInDay.length < 10) && isAfter(compareDateSendByUser, compareCurrentDate)
        }
      )
    })

    return availability
  }
}

