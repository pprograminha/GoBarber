import { celebrate, Joi, Segments } from 'celebrate'
import { Router } from 'express'
import ProfileController from '../controllers/ProfileController'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

const profileRouter = Router()
const profileController = new ProfileController()

profileRouter.use(ensureAuthenticated)

profileRouter.get('/', profileController.show)
profileRouter.put('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    old_password: Joi.string(),
    password: Joi.when('old_password', {
      is: Joi.exist(),
      then: Joi.string().required()
    }),
    password_confirmation: Joi.when('password', {
      is: Joi.exist(),
      then: Joi.string().required().valid(Joi.ref('password'))
    })
  }
}),profileController.update)

export default profileRouter
