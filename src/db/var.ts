export const DB_NAME = 'PASTE_BOT';
export const TABLE_TEXT_NAME = 'text';

export interface TextTableType {
  id?: number;
  text: string;
  date: Date;
}
