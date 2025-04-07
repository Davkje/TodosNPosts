import { RowDataPacket } from "mysql2";

export interface ITodo extends RowDataPacket { //  Utökat MySQL2:s RowDataPacket typescript funktion
  id: number;
  content: string;
  done: boolean;
  created_at: string;
}