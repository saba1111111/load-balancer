export interface ICentralizedMemoryStore {
  get<ValueType>(key: string): Promise<ValueType | null>;

  remove(key: string): Promise<string | boolean | number>;

  add<ValueType>(
    key: string,
    value: ValueType,
    expiration?: number
  ): Promise<string | boolean | number>;
}
