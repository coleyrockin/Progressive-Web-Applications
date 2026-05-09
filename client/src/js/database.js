import { openDB } from 'idb';

const DB_NAME = 'jate';
const STORE_NAME = 'jate';

const dbPromise =
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains(STORE_NAME)) {
        return;
      }
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  }).catch((error) => {
    throw new Error(`IndexedDB init failed: ${error.message}`);
  });

// Store the latest editor snapshot at a stable key so reloads restore one document.
export const putDb = async (content) => {
  const jateDb = await dbPromise;
  const tx = jateDb.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  await store.put({ id: 1, value: content });
  return tx.done;
};

export const getDb = async () => {
  const jateDb = await dbPromise;
  const tx = jateDb.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(1);
  const result = await request;
  return result?.value;
};
