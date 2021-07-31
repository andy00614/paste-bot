import { Connection } from 'jsstore';
import { idbCon } from './idb_service';

export default class BaseService {
  connection: Connection;

  constructor() {
    this.connection = idbCon;
  }
}
