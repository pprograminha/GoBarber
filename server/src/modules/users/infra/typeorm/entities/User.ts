import { Exclude, Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import uploadConfig from '@config/upload'
@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  email: string

  @Column()
  @Exclude()
  password: string

  @Column()
  avatar: string

  @UpdateDateColumn()
  updated_at: Date

  @CreateDateColumn()
  created_at: Date

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if(!this.avatar) return null

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_API_URL}/static/${this.avatar}`
      case 's3':
        return `https://${uploadConfig.config.s3.bucket}.s3.amazonaws.com/${this.avatar}`
      default:
        return null
    }
  }
}
export default User
