import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO"
import INotificationRepository from "@modules/notifications/repositories/INotificationsRepository"
import { getMongoRepository, MongoRepository } from "typeorm"
import Notification from "../schemas/Notification"

export default class NotificationsRepository implements INotificationRepository{
  private ormRepository: MongoRepository<Notification>

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo')
  }
  async create({
    content,
    recipient_id
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id
    })

    await this.ormRepository.save(notification)

    return notification
  }

}
