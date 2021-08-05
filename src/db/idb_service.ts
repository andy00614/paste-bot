import { DATA_TYPE, Connection, ITable, IDataBase } from 'jsstore';
import workerInjector from 'jsstore/dist/worker_injector';
import { DB_NAME, TABLE_TEXT_NAME } from './var';

// This will ensure that we are using only one instance.
// Otherwise due to multiple instance multiple worker will be created.
export const idbCon = new Connection();
idbCon.addPlugin(workerInjector);

const getDb = () => {
  const tableText: ITable = {
    name: TABLE_TEXT_NAME,
    columns: {
      id: {
        primaryKey: true,
        autoIncrement: true,
        dataType: DATA_TYPE.String || DATA_TYPE.Number,
      },
      text: { notNull: true, dataType: DATA_TYPE.String },
      date: { notNull: true, dataType: DATA_TYPE.DateTime },
      type: { notNull: true, dataType: DATA_TYPE.String },
      buffer: { notNull: false, dataType: DATA_TYPE.Object },
    },
  };

  const database: IDataBase = {
    name: DB_NAME,
    tables: [tableText],
  };
  return database;
};

export const initJsStore = () => {
  try {
    const dataBase = getDb();
    idbCon.initDb(dataBase);
  } catch (e) {
    throw new Error(e);
  }
};
