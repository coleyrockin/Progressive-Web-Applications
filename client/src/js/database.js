import { openDB } from 'idb';

const DB_NAME = 'jate';
const STORE_NAME = 'jate';

const initdb = async () =>
  openDB(DB_NAME, 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        return;
      }
      db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
    },
  }).catch((error) => {
    throw new Error(`IndexedDB init failed: ${error.message}`);
  });

// Method that takes some content and adds it to the IndexedDB database using the idb module
export const putDb = async (content) => {
  const jateDb = await openDB(DB_NAME, 1);
  const tx = jateDb.transaction(STORE_NAME, 'readwrite');
  const store = tx.objectStore(STORE_NAME);
  const request = store.put({ id: 1, value: content });
  return request;
};

// Method that gets content from the IndexedDB database using the idb module
export const getDb = async () => {
  const jateDb = await openDB(DB_NAME, 1);
  const tx = jateDb.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(1);
  const result = await request;
  return result?.value;
};

initdb().catch((error) => {
  console.error('IndexedDB initialization failed', error);
});
