import levelup from 'levelup';
import leveldown from 'leveldown';
import rocksdb from 'rocksdb';
import fs from 'fs';

const SUPPORTED_TYPE = ['leveldb', 'rocksdb'];

export const openDatabase = (path, type) => {
  if (!SUPPORTED_TYPE.includes(type)) {
    throw new Error('error.type_not_support');
  }
  if (!fs.existsSync(path)) {
    throw new Error('error.path_not_found');
  }
  const stat = fs.statSync(path);
  if (!stat.isDirectory()) {
    throw new Error('error.path_not_directory');
  }
  // try to open the database
  return new Promise((resolve, reject) => {
    let db;
    if (type === 'leveldb') {
      db = levelup(
        leveldown(path),
        {
          createIfMissing: false,
        },
        (err) => {
          if (err) reject(err);
          resolve(db);
        },
      );
    } else if (type === 'rocksdb') {
      db = levelup(
        rocksdb(path),
        {
          createIfMissing: false,
        },
        (err) => {
          if (err) reject(err);
          resolve(db);
        },
      );
    }
  });
};
