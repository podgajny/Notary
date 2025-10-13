const DB_NAME = 'notary'
const DB_VERSION = 1
const STORE_NAME = 'notes'
const NOTES_KEY = 'notes:v1'

export type StoredNote = {
  id: string
  title: string
  body: string
  tags: string[]
  pinned: boolean
  createdAt: number
  updatedAt: number
}

export type DbErrorCode =
  | 'DB_UNAVAILABLE'
  | 'DB_OPEN_FAILED'
  | 'DB_READ_FAILED'
  | 'DB_WRITE_FAILED'

export class DbError extends Error {
  code: DbErrorCode

  constructor(code: DbErrorCode, message: string) {
    super(message)
    this.name = 'DbError'
    this.code = code
  }
}

const getIndexedDB = (): IDBFactory => {
  const idb = typeof indexedDB !== 'undefined' ? indexedDB : undefined

  if (!idb) {
    throw new DbError('DB_UNAVAILABLE', 'IndexedDB is not supported in this environment')
  }

  return idb
}

const openDatabase = async (): Promise<IDBDatabase> => {
  const idb = getIndexedDB()

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = idb.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const database = request.result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => {
      resolve(request.result)
    }

    request.onerror = () => {
      reject(new DbError('DB_OPEN_FAILED', request.error?.message ?? 'Failed to open IndexedDB'))
    }
  })
}

const runTransaction = async <T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
  errorCode: DbErrorCode,
): Promise<T> => {
  const db = await openDatabase()

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode)
    const store = transaction.objectStore(STORE_NAME)

    let request: IDBRequest<T>

    try {
      request = operation(store)
    } catch (error) {
      reject(new DbError(errorCode, (error as Error)?.message ?? 'IndexedDB operation failed'))
      transaction.abort()
      return
    }

    let result: T

    request.onsuccess = () => {
      result = request.result as T
    }

    const handleFailure = (event: Event) => {
      const domException = (event.target as IDBRequest | IDBTransaction | null)?.error
      reject(new DbError(errorCode, domException?.message ?? 'IndexedDB operation failed'))
    }

    request.onerror = (event) => {
      handleFailure(event)
    }

    transaction.onerror = (event) => {
      handleFailure(event)
    }

    transaction.oncomplete = () => {
      db.close()
      resolve(result)
    }
  })
}

export const getNotes = async (): Promise<StoredNote[]> => {
  try {
    const result = await runTransaction('readonly', (store) => store.get(NOTES_KEY), 'DB_READ_FAILED')

    if (typeof result === 'string') {
      try {
        const parsed = JSON.parse(result) as StoredNote[]

        if (Array.isArray(parsed)) {
          return parsed
        }
      } catch (parseError) {
        throw new DbError('DB_READ_FAILED', (parseError as Error).message)
      }
    }

    if (Array.isArray(result)) {
      return result as StoredNote[]
    }

    return []
  } catch (error) {
    if (error instanceof DbError) {
      throw error
    }

    throw new DbError('DB_READ_FAILED', (error as Error)?.message ?? 'Failed to read notes from IndexedDB')
  }
}

export const setNotes = async (notes: StoredNote[]): Promise<void> => {
  const serialised = JSON.stringify(notes)

  try {
    await runTransaction('readwrite', (store) => store.put(serialised, NOTES_KEY), 'DB_WRITE_FAILED')
  } catch (error) {
    if (error instanceof DbError) {
      throw error
    }

    throw new DbError('DB_WRITE_FAILED', (error as Error)?.message ?? 'Failed to persist notes to IndexedDB')
  }
}

export const clearNotes = async (): Promise<void> => {
  try {
    await runTransaction('readwrite', (store) => store.delete(NOTES_KEY), 'DB_WRITE_FAILED')
  } catch (error) {
    if (error instanceof DbError) {
      throw error
    }

    throw new DbError('DB_WRITE_FAILED', (error as Error)?.message ?? 'Failed to clear notes from IndexedDB')
  }
}
