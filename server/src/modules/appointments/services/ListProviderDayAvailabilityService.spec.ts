import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository"
import ListProviderDayAvailabilityService from "./ListProviderDayAvailabilityService"

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderDayAvailability: ListProviderDayAvailabilityService
describe('ListProviderDayAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository()
    listProviderDayAvailability = new ListProviderDayAvailabilityService(fakeAppointmentsRepository)
  })

  it(`should be able to list the provider's one day availability`, async () => {
    const provider_id = '1'
    const user_id = '2'
    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 14, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id,
      user_id,
      date: new Date(2021, 4, 20, 15, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 20, 11).getTime(); // current
    });

    const availability = await listProviderDayAvailability.execute({
      provider_id,
      year: 2021,
      month: 5,
      day: 20,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 10, available: false },
        { hour: 13, available: true },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
      ]),
    );
  })
})
