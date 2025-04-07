import { Request, Response } from "express";
// import { Todo } from "../models/Todo";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// const todos: Todo[] = [new Todo("AAA"), new Todo("BBB"), new Todo("CCC", true), new Todo("Handla mat"), new Todo("Käka mat", true), new Todo("Diska"), new Todo("Diska")];

// FETCH ALL TODOS
export const fetchAllTodos = async (req: Request, res: Response) => {
	try {
		const [rows] = await db.query<RowDataPacket[]>("SELECT * FROM todos");
		res.json(rows);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// FETCH TODO
export const fetchTodo = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      SELECT * FROM todos 
      WHERE id = ?
    `;
		const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
		const todo = rows[0];
		if (!todo) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}
		res.json(todo);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// CREATE TODO
export const createTodo = async (req: Request, res: Response) => {
	const content = req.body.content;
	if (content === undefined) {
		res.status(400).json({ error: "Content is required" });
		return;
	}

	try {
		const sql = `
      INSERT INTO todos (content)
      VALUES (?)
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [content]);
		res.status(201).json({ message: "Todo created", id: result.insertId });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// UPDATE TODO
export const updateTodo = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { content, done } = req.body; // Destructur objektet från request body

  if (content === undefined || done === undefined) {
    res.status(400).json({ error: "Content and Done are required" });
    return;
  }

  try {
    const sql = `
      UPDATE todos
      SET content = ?, done = ?
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [content, done, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Todo not found" });
      return;
    }

    res.json({ message: "Todo updated", data: { id, content, done } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// DELETE TODO
export const deleteTodo = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      DELETE FROM todos
      WHERE id = ?
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [id]);
		if (result.affectedRows === 0) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}
		res.json({ message: "Todo deleted" });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};
