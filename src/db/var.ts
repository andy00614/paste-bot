export const DB_NAME = 'PASTE_BOT_V2';
export const TABLE_TEXT_NAME = 'text';

export interface TextTableType {
  id?: number | string;
  text: string;
  date: Date;
  type: 'image' | 'text';
  buffer?: Buffer;
}
