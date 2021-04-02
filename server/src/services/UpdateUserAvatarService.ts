import path from "path";
import { getRepository } from "typeorm";
import uploadConfig from "../config/upload";
import AppError from "../errors/AppError";
import User from "../models/User";
import fs from "fs";
interface RequestDTO {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  /**
   * execute
   */
  public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
    const usersRepository = getRepository(User);
    const user = await usersRepository.findOne(user_id);

    if (!user) throw new AppError("Only autheticated users!", 401);

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      try {
        const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
        if (userAvatarFileExists) {
          await fs.promises.unlink(userAvatarFilePath);
        }
      } catch {}
    }
    user.avatar = avatarFileName;

    await usersRepository.save(user);

    return user;
  }
}
export default UpdateUserAvatarService;