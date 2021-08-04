import BaseService from './base_service';
import { TABLE_TEXT_NAME, TextTableType } from './var';

export default class TextService extends BaseService {
  tableName: string;

  constructor() {
    super();
    this.tableName = TABLE_TEXT_NAME;
  }

  addText(textInfo: TextTableType) {
    return this.connection.insert({
      into: this.tableName,
      values: [textInfo],
      return: true,
    });
  }

  getTexts(): Promise<TextTableType[]> {
    return this.connection.select({
      from: this.tableName,
    });
  }

  getTextByWord(word: string): Promise<TextTableType[]> {
    return this.connection.select({
      from: this.tableName,
      where: {
        text: {
          like: `%${word}%`,
        },
      },
    });
  }

  removeTextById(id: number) {
    return this.connection.remove({
      from: this.tableName,
      where: {
        id,
      },
    });
  }
}
