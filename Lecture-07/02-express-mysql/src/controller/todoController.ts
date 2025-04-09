import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// FETCH ALL TODOS W. SEARCH AND SORT
export const fetchAllTodos = async (req: Request, res: Response) => {
	const search = req.query.search as string | undefined;
	const sort = (req.query.sort as string) || "asc";

	try {
		let sql = "SELECT * FROM todos";
		const values: any[] = [];

		if (search) {
			sql += " WHERE content LIKE ?";
			values.push(`%${search}%`);
		}

		sql += " ORDER BY content " + (sort === "desc" ? "DESC" : "ASC");

		const [rows] = await db.query<RowDataPacket[]>(sql, values);
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
      SELECT 
        todos.id AS todo_id,
        todos.content AS todo_content,
        todos.done AS todo_done,
        todos.created_at AS todo_created_at,
        subtasks.id AS subtask_id,
        subtasks.todo_id AS subtask_todo_id,
        subtasks.content AS subtask_content,
        subtasks.done AS subtask_done,
        subtasks.created_at AS subtask_created_at
      FROM todos
      LEFT JOIN subtasks ON todos.id = subtasks.todo_id
      WHERE todos.id = ?
    `;
		const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
		const todo = rows[0];
		if (!todo) {
			res.status(404).json({ message: "Todo not found" });
			return;
		}
		res.json(formatTodo(rows));
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// FORMAT TODOS RETURN (W. SUBTASKS )
const formatTodo = (rows: any) => ({
	id: rows[0].todo_id,
	content: rows[0].todo_content,
	done: rows[0].todo_done,
	created_at: rows[0].todo_created_at,
	subtasks: rows
  .filter((row: any) => row.subtask_id !== null)
  .map((row: any) => ({
		id: row.subtask_id,
    todo_id: row.subtask_todo_id,
		content: row.subtask_content,
		done: row.subtask_done,
		created_at: row.subtask_created_at,
	})),
});

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
