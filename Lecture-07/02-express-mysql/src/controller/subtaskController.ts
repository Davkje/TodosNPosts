import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// FETCH ALL SUBTASKS W. SEARCH AND SORT
export const fetchAllSubtasks = async (req: Request, res: Response) => {
	const search = req.query.search as string | undefined;
  const sort = req.query.sort as string || "asc";

	try {
		let sql = "SELECT * FROM subtasks";
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

// FETCH SUBTASK
export const fetchSubtask = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      SELECT * FROM subtasks 
      WHERE id = ?
    `;
		const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
		const subtask = rows[0];
		if (!subtask) {
			res.status(404).json({ message: "Subtask not found" });
			return;
		}
		res.json(subtask);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// CREATE SUBTASK
export const createSubtask = async (req: Request, res: Response) => {
	const todo_id = req.body.todo_id;
	const content = req.body.content;
	if (content === undefined || todo_id === undefined) {
		res.status(400).json({ error: "Todo_id and content is required" });
		return;
	}

	try {
		const sql = `
      INSERT INTO subtasks (todo_id, content)
      VALUES (?, ?)
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [todo_id, content]);
		res.status(201).json({ message: "Subtask created", id: result.insertId });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// UPDATE SUBTASK
export const updateSubtask = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { content, done } = req.body; // Destructur objektet från request body

  if (content === undefined || done === undefined) {
    res.status(400).json({ error: "Content and Done are required" });
    return;
  }

  try {
    const sql = `
      UPDATE subtasks
      SET content = ?, done = ?
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [content, done, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Subtask not found" });
      return;
    }

    res.json({ message: "Subtask updated", data: { id, content, done } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// DELETE SUBTASK
export const deleteSubtask = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      DELETE FROM subtasks
      WHERE id = ?
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [id]);
		if (result.affectedRows === 0) {
			res.status(404).json({ message: "Subtask not found" });
			return;
		}
		res.json({ message: "Subtask deleted" });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};
