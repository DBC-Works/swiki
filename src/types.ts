/**
 * Non empty array
 */
export type NonEmptyArray<T> = [T, ...T[]]

/**
 * UUID
 */
export type Uuid = ReturnType<Crypto['randomUUID']>
