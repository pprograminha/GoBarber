export default interface ICacheProvider {
  save(key: string, value: any): Promise<void>
  recover<T = string>(key: string): Promise<T | undefined>
  invalidate(key: string): Promise<void>
  invalidatePrefix(prefix: string): Promise<void>
}
