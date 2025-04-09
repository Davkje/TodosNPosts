import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// FETCH ALL COMMENTS W. SEARCH AND SORT
export const fetchAllComments = async (req: Request, res: Response) => {
	const search = req.query.search as string | undefined;
  const sort = req.query.sort as string || "asc";

	try {
		let sql = "SELECT * FROM comments";
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

// FETCH COMMENT
export const fetchComment = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      SELECT * FROM comments 
      WHERE id = ?
    `;
		const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
		const comment = rows[0];
		if (!comment) {
			res.status(404).json({ message: "Comment not found" });
			return;
		}
		res.json(comment);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// CREATE COMMENT
export const createComment = async (req: Request, res: Response) => {
	const post_id = req.body.post_id;
	const content = req.body.content;
	const author = req.body.author;
	if (content === undefined || post_id === undefined || author === undefined) {
		res.status(400).json({ error: "Post_id, content and author is required" });
		return;
	}

	try {
		const sql = `
      INSERT INTO comments (post_id, content, author)
      VALUES (?, ?, ?)
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [post_id, content, author]);
		res.status(201).json({ message: "Comment created", id: result.insertId });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// UPDATE COMMENT
export const updateComment = async (req: Request, res: Response) => {
  const id = req.params.id;
  const post_id = req.body.post_id;
	const content = req.body.content;
	const author = req.body.author;

	if (content === undefined || post_id === undefined || author === undefined) {
		res.status(400).json({ error: "Post_id, content and author is required" });
		return;
	}

  try {
    const sql = `
      UPDATE comments
      SET post_id = ?, content = ?, author = ?
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [post_id, content, author, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    res.json({ message: "Comment updated", data: { id, post_id, content, author } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// DELETE COMMENT
export const deleteComment = async (req: Request, res: Response) => {
	const id = req.params.id;

	try {
		const sql = `
      DELETE FROM comments
      WHERE id = ?
    `;
		const [result] = await db.query<ResultSetHeader>(sql, [id]);
		if (result.affectedRows === 0) {
			res.status(404).json({ message: "Comment not found" });
			return;
		}
		res.json({ message: "Comment deleted" });
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};
