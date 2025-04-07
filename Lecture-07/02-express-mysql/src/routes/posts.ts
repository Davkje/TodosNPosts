import express from 'express';
import {
  createPost,
  deletePost,
  fetchAllPosts,
  fetchPost,
  updatePost } from '../controller/postController';
const router = express.Router()

router.get('/', fetchAllPosts)
router.get('/:id', fetchPost)
router.post('/', createPost)
router.patch('/:id', updatePost)
router.delete('/:id', deletePost)

export default router;