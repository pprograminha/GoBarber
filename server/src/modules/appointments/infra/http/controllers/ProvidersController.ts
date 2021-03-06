import { Response, Request } from 'express'
import ListProvidersService from '@modules/appointments/services/ListProvidersService'
import { container } from 'tsyringe'
import { classToClass } from 'class-transformer'

export default class ProvidersController {
  async index(request: Request, response: Response): Promise<Response> {

    const user_id = request.user.id

    const listProviders = container.resolve(ListProvidersService)

    const providers = await listProviders.execute({
      user_id
    })
    return response.status(200).json(classToClass(providers))
  }
}
