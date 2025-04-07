import { RowDataPacket } from "mysql2";

export interface IPost extends RowDataPacket {
  id: number;
  title: string;
  content: string;
  author: string;
}