import { RowDataPacket } from "mysql2";

// HELPS WITH TYPING

export interface ITodoDBResponse extends RowDataPacket { //  Utökat MySQL2:s RowDataPacket typescript funktion
  todo_id: number;
  todo_content: string;
  todo_done: boolean;
  todo_created_at: string;
  subtask_id: number;
  subtask_todo_id: number;
  subtask_content: string;
  subtask_done: boolean;
  subtask_created_at: string;
}