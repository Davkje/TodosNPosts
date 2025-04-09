import express from 'express';
import { 
  createComment, 
  deleteComment, 
  fetchAllComments, 
  fetchComment, 
  updateComment } from '../controller/commentController';
const router = express.Router()

router.get('/', fetchAllComments)
router.get('/:id', fetchComment)
router.post('/', createComment)
router.patch('/:id', updateComment)
router.delete('/:id', deleteComment)

export default router;
