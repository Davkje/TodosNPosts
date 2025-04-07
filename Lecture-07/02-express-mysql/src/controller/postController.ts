import { Request, Response } from "express";
import { db } from "../config/db";
import { ResultSetHeader, RowDataPacket } from "mysql2";

// FETCH ALL POSTS
export const fetchAllPosts = async (req: Request, res: Response) => {
	const search = req.query.search as string | undefined;
  const sort = req.query.sort as string || "asc";

	try {
		let sql = "SELECT * FROM posts";
		const values: any[] = [];

		if (search) {
			sql += " WHERE content LIKE ? OR author LIKE ? OR title LIKE ?";
			values.push(`%${search}%`, `%${search}%`, `%${search}%`);
		}

    // Lägg till ORDER BY för sortering
		sql += " ORDER BY title " + (sort === "desc" ? "DESC" : "ASC");

		const [rows] = await db.query<RowDataPacket[]>(sql, values);
		res.json(rows);
	} catch (error: unknown) {
		const message = error instanceof Error ? error.message : "Unknown error";
		res.status(500).json({ error: message });
	}
};

// FETCH POST
export const fetchPost = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
      SELECT * FROM posts 
      WHERE id = ?
    `;
    const [rows] = await db.query<RowDataPacket[]>(sql, [id]);
    const post = rows[0];
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json(post);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// CREATE POST
export const createPost = async (req: Request, res: Response) => {
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;
  if (title === undefined || content === undefined || author === undefined) {
    res.status(400).json({ error: "Title, content and author are required" });
    return;
  }
  try {
    const sql = `
      INSERT INTO posts (title, content, author)
      VALUES (?, ?, ?)
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [title, content, author]);
    res.status(201).json({ message: "Post created", id: result.insertId });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// UPDATE POST
export const updatePost = async (req: Request, res: Response) => {
  const id = req.params.id;
  const title = req.body.title;
  const content = req.body.content;
  const author = req.body.author;

  if (title === undefined || content === undefined || author === undefined) {
    res.status(400).json({ error: "Title, content and author are required" });
    return;
  }

  try {
    const sql = `
      UPDATE posts 
      SET title = ?, content = ?, author = ?
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [title, content, author, id]);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    res.json({ message: "Post updated", data: { id, title, content, author } });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};

// DELETE POST 
export const deletePost = async (req: Request , res: Response) => {
  const id = req.params.id;

  try {
    const sql = `
      DELETE FROM posts
      WHERE id = ?
    `;
    const [result] = await db.query<ResultSetHeader>(sql, [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ message: "Post not found" });
      return;
    }
    res.json({ message: "Post deleted" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ error: message });
  }
};
