import cacheConfig from '@config/cache'
import Redis, {Redis as RedisClient} from 'ioredis'
import ICacheProvider from "../models/ICacheProvider";

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient
  constructor(){
    this.client = new Redis(cacheConfig.config.redis)
  }
  async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value))
  }
  async recover<T = string>(key: string): Promise<T | undefined> {
    const data = await this.client.get(key)

    if(!data) return undefined

    const parsedData = JSON.parse(data)

    return parsedData as T
  }
  async invalidate(key: string): Promise<void> {
    await this.client.del(key)
  }
  async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`)

    const pipeline = this.client.pipeline()

    keys.forEach(key => {
      pipeline.del(key)
    })

    await pipeline.exec()

  }
}
